"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  X, Send, ChevronDown, Trash2, MessageSquare,
  Clock, Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRAG, type Message } from "./RAGProvider";
import { RAGTypingIndicator } from "./RAGTypingIndicator";
import { QuickActions } from "./QuickActions";
import { generateId } from "@/lib/utils";
import {
  AnalyzeIcon, HistoryIcon, NewChatIcon, SneakoraLogoIcon,
} from "./RAGIcons";

// ─── Spring & Motion Config ───────────────────

const springFluid = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
  mass: 0.75,
};

const springSnap = {
  type: "spring" as const,
  stiffness: 360,
  damping: 18,
  mass: 0.5,
};

const springFloat = {
  type: "spring" as const,
  stiffness: 160,
  damping: 22,
  mass: 0.85,
};

const springMessage = {
  type: "spring" as const,
  stiffness: 280,
  damping: 26,
  mass: 0.6,
};

const bezierGlass = {
  ease: [0.32, 0.72, 0, 1] as const,
  duration: 0.7,
};

const bezierQuick = {
  ease: [0.32, 0.72, 0, 1] as const,
  duration: 0.4,
};

// ─── Stagger Variants ─────────────────────────

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.15,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: springFloat,
  },
};

// ─── Helpers ─────────────────────────────────

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

// ─── Reusable Glass Button ────────────────────

function GlassIconButton({
  children,
  onClick,
  label,
  active = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.86 }}
      onClick={onClick}
      className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        active
          ? "bg-white/[0.08] text-white/70"
          : "text-white/25 hover:text-white/60"
      }`}
      aria-label={label}
    >
      {children}
      <span className="absolute inset-0 rounded-xl bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" />
    </motion.button>
  );
}

// ─── RAGWidget ────────────────────────────────

export function RAGWidget() {
  const {
    conversations,
    activeConversationId,
    messages,
    isOpen,
    isTyping,
    addMessage,
    appendToLastMessage,
    clearMessages,
    setIsOpen,
    setIsTyping,
    startNewConversation,
    switchConversation,
    deleteConversation,
  } = useRAG();

  const [input, setInput] = useState("");
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [hasScrolledUp, setHasScrolledUp] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!hasScrolledUp) scrollToBottom();
  }, [messages, isTyping, hasScrolledUp]);

  const handleScroll = () => {
    const el = messagesEndRef.current?.parentElement;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setHasScrolledUp(!isNearBottom);
  };

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 400);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent, query?: string) => {
    e.preventDefault();
    const finalQuery = query || input.trim();
    if (!finalQuery || isTyping) return;
    setErrorMessage(null);

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: finalQuery,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    addMessage({ role: "assistant", content: "" });
    setConversationHistory((prev) => [
      ...prev,
      { role: "user", content: finalQuery },
    ]);
    setInput("");
    setIsTyping(true);
    setCurrentPhase("analyzing");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("/api/rag/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: finalQuery,
          conversationHistory,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";
      let sseBuffer = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          sseBuffer += decoder.decode(value, { stream: true });
          const lines = sseBuffer.split("\n");
          sseBuffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "error") {
                  setErrorMessage(data.text);
                  setIsTyping(false);
                  setCurrentPhase(null);
                  return;
                }
                if (data.type === "phase") {
                  setCurrentPhase(data.phase);
                  continue;
                }
                if (data.text) {
                  appendToLastMessage(data.text);
                  fullResponse += data.text;
                }
                if (data.done) {
                  if (data.fullResponse) fullResponse = data.fullResponse;
                }
              } catch {
                //
              }
            }
          }
        }
      }

      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: fullResponse },
      ]);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setErrorMessage("Request timed out. Please try a simpler question.");
      } else {
        setErrorMessage("Connection error. Please check your internet and try again.");
      }
    } finally {
      setIsTyping(false);
      setCurrentPhase(null);
    }
  };

  const handleQuickAction = (query: string) => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent, query);
  };

  const handleNewChat = () => {
    startNewConversation();
    setConversationHistory([]);
    setErrorMessage(null);
  };

  const handleSwitchConv = (id: string) => {
    switchConversation(id);
    setConversationHistory([]);
    setErrorMessage(null);
    setShowHistory(false);
  };

  const handleDeleteConv = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Delete this conversation?")) {
      deleteConversation(id);
      if (id === activeConversationId) {
        setConversationHistory([]);
      }
    }
  };

  // ════════════════════════════════════════════
  // CLOSED STATE — Glass Orb
  // ════════════════════════════════════════════

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={springSnap}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.88 }}
        onClick={() => setIsOpen(true)}
        className="group fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center"
        aria-label="Open AI Assistant"
      >
        {/* Ambient glow aura */}
        <motion.span
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 via-indigo-500/15 to-transparent blur-xl"
        />

        {/* Glass orb body */}
        <span className="absolute inset-0 rounded-full bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] shadow-[0_12px_48px_rgba(0,0,0,0.6)]" />

        {/* Inner specular highlight */}
        <span className="absolute inset-[3px] rounded-full bg-gradient-to-b from-white/[0.08] to-transparent" />

        {/* Inner color wash */}
        <span className="absolute inset-[7px] rounded-full bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent" />

        {/* Icon */}
        <span className="relative flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-violet-500/20 blur-md scale-150 group-hover:bg-violet-500/30 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]" />
          <SneakoraLogoIcon className="relative h-7 w-7 text-violet-300/80 group-hover:text-violet-200 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" />
        </span>

        {/* Live indicator dot */}
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping" style={{ animationDuration: "2.5s" }} />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-black/50" />
        </span>
      </motion.button>
    );
  }

  // ════════════════════════════════════════════
  // OPEN STATE — Floating Glass Island
  // ════════════════════════════════════════════

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  return (
    <AnimatePresence>
      <motion.div
        key="rag-widget"
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.94 }}
        transition={springFluid}
        className="fixed bottom-4 right-4 z-[60] flex flex-col h-[560px] w-[calc(100vw-2rem)] sm:h-[680px] sm:w-[460px] max-h-[calc(100dvh-2.5rem)]"
      >
        {/* ── Double-Bezel Outer Shell ── */}
        <div className="flex flex-1 flex-col overflow-hidden bg-[#050505]/95 backdrop-blur-2xl border border-white/[0.06] rounded-[1.75rem] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.8)] p-[5px] sm:rounded-[1.75rem] sm:border-white/[0.06]">
          {/* ── Inner Core ── */}
          <div className="relative flex flex-1 flex-col overflow-hidden bg-[#0A0A0A] rounded-[calc(1.75rem-5px)]">

            {/* Ethereal background orbs — fixed behind content */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-violet-500/8 blur-[100px]" />
              <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-indigo-500/6 blur-[120px]" />
            </div>

            {/* ═══ HEADER — Dynamic Island Pill ═══ */}
            <div className="relative z-10 mx-3 mt-3 mb-1.5">
              <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.06]">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/20 via-indigo-500/10 to-transparent" />
                    <SneakoraLogoIcon className="relative h-[18px] w-[18px] text-violet-300/90" />
                  </div>
                  <div>
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15, ...bezierGlass }}
                      className="text-sm font-semibold tracking-tight text-white/85"
                    >
                      Sneakora AI
                    </motion.span>
                    {activeConv && messages.length > 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, ...bezierGlass }}
                        className="text-[10px] text-white/25 truncate max-w-[120px] sm:max-w-[180px] leading-tight"
                      >
                        {activeConv.name}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  <GlassIconButton onClick={handleNewChat} label="New conversation">
                    <Plus className="h-4 w-4" />
                  </GlassIconButton>
                  {conversations.length > 0 && (
                    <GlassIconButton
                      onClick={() => setShowHistory(!showHistory)}
                      label="Conversation history"
                      active={showHistory}
                    >
                      <HistoryIcon className="h-4 w-4" />
                    </GlassIconButton>
                  )}
                  {messages.length > 0 && (
                    <GlassIconButton
                      onClick={() => { clearMessages(); setErrorMessage(null); }}
                      label="Clear chat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </GlassIconButton>
                  )}
                  <GlassIconButton onClick={() => setIsOpen(false)} label="Close">
                    <X className="h-4 w-4" />
                  </GlassIconButton>
                </div>
              </div>
            </div>

            {/* ═══ HISTORY PANEL ═══ */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={bezierQuick}
                  className="overflow-hidden border-b border-white/[0.04]"
                >
                  <div className="px-5 py-3 space-y-1 max-h-[220px] overflow-y-auto">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/15 px-2 pb-2 font-medium">
                      Conversations &middot; {conversations.length}
                    </p>
                    {conversations.map((conv, i) => (
                      <motion.button
                        key={conv.id}
                        initial={{ opacity: 0, x: -12, filter: "blur(4px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        transition={{ delay: i * 0.025, ...springFloat }}
                        onClick={() => handleSwitchConv(conv.id)}
                        className={`group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] ${
                          conv.id === activeConversationId
                            ? "bg-white/[0.08] text-white/80"
                            : "text-white/35 hover:bg-white/[0.03] hover:text-white/55"
                        }`}
                      >
                        <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" />
                        <span className="flex-1 truncate text-xs font-medium tracking-tight">
                          {conv.name}
                        </span>
                        <span className="text-[10px] text-white/15 shrink-0 font-mono">
                          {conv.messages.length}
                        </span>
                        <span
                          onClick={(e) => handleDeleteConv(e, conv.id)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleDeleteConv(e as unknown as React.MouseEvent, conv.id); } }}
                          role="button"
                          tabIndex={0}
                          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg text-white/10 opacity-0 group-hover:opacity-100 hover:text-white/40 hover:bg-white/[0.06] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                          aria-label="Delete conversation"
                        >
                          <X className="h-3 w-3" />
                        </span>
                      </motion.button>
                    ))}
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      onClick={handleNewChat}
                      className="group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-violet-400/60 hover:text-violet-400 hover:bg-white/[0.03] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
                    >
                      <NewChatIcon className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" />
                      Start new conversation
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ═══ MESSAGES ═══ */}
            <div
              className="relative z-10 flex-1 overflow-y-auto px-5 py-5 space-y-5 scrollbar-hide"
              onScroll={handleScroll}
            >
              {messages.length === 0 && !isTyping && !errorMessage && (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col items-center justify-center h-full text-center px-2"
                >
                  <motion.div variants={staggerItem} className="mb-6 relative">
                    <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white/[0.03] border border-white/[0.06]">
                      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent" />
                      <MessageSquare className="relative h-9 w-9 text-violet-400/70" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-violet-500/10 blur-md" />
                  </motion.div>
                  <motion.h3
                    variants={staggerItem}
                    className="text-2xl font-semibold tracking-tight text-white/85"
                  >
                    How can I help you?
                  </motion.h3>
                  <motion.p
                    variants={staggerItem}
                    className="mt-2.5 text-sm text-white/35 max-w-xs leading-relaxed"
                  >
                    Ask about our products, your orders, or get style recommendations.
                  </motion.p>
                  <motion.div
                    variants={staggerItem}
                    className="mt-10 w-full max-w-sm"
                  >
                    <QuickActions onSelect={handleQuickAction} />
                  </motion.div>
                </motion.div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((message, idx) => {
                  const isUser = message.role === "user";
                  const isLast = idx === messages.length - 1;
                  const isEmptyAssistant = isLast && !isUser && !message.content && isTyping;

                  const showDate =
                    idx === 0 ||
                    formatDate(messages[idx - 1].timestamp) !== formatDate(message.timestamp);

                  return (
                    <React.Fragment key={message.id}>
                      {showDate && !isEmptyAssistant && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.05, ...bezierGlass }}
                          className="flex items-center gap-4 py-1"
                        >
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-white/[0.02]" />
                          <span className="text-[10px] text-white/15 font-medium uppercase tracking-[0.15em]">
                            {formatDate(message.timestamp)}
                          </span>
                          <div className="flex-1 h-px bg-gradient-to-r from-white/[0.02] via-white/[0.04] to-transparent" />
                        </motion.div>
                      )}
                      {!isEmptyAssistant && (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 12, scale: 0.96, filter: "blur(4px)" }}
                          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                          transition={{ delay: showDate ? 0.08 : 0, ...springMessage }}
                          className={`flex gap-3 items-start ${isUser ? "flex-row-reverse" : ""}`}
                        >
                          {/* Avatar */}
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                              isUser
                                ? "bg-white/[0.08] border border-white/[0.06] text-white/70"
                                : "bg-white/[0.05] border border-white/[0.06] text-white/30"
                            }`}
                          >
                            {isUser ? (
                              <span className="text-[11px] font-semibold">
                                {message.content.charAt(0).toUpperCase() || "U"}
                              </span>
                            ) : (
                              <SneakoraLogoIcon className="h-4 w-4 opacity-70" />
                            )}
                          </div>

                          {/* Bubble */}
                          <div
                            className={`max-w-[82%] ${
                              isUser
                                ? "rounded-2xl rounded-tr-md bg-gradient-to-br from-violet-600/90 to-indigo-700/90 px-4 py-2.5 text-sm text-white shadow-lg shadow-violet-600/15"
                                : message.content
                                ? "rounded-2xl rounded-tl-md bg-white/[0.04] px-4 py-2.5 text-sm text-white/75 border border-white/[0.04] shadow-sm"
                                : ""
                            }`}
                          >
                            {message.content}
                            {message.content && (
                              <div className="mt-2 flex items-center gap-1.5 opacity-40">
                                <Clock className="h-3 w-3" />
                                <span className="text-[10px]">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>

              {/* ── Typing indicator (empty assistant message) ── */}
              {isTyping && messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1]?.content === "" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 items-start"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.06]">
                    <SneakoraLogoIcon className="h-4 w-4 opacity-70" />
                  </div>
                  <div className="rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.04] px-4 py-3">
                    {currentPhase && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1.5 mb-2"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" style={{ animationDuration: "1.5s" }} />
                        <span className="text-[10px] text-violet-400/60 font-medium tracking-wide">
                          {currentPhase === "analyzing" && "Analyzing..."}
                          {currentPhase === "searching" && "Searching..."}
                          {currentPhase === "matching" && "Matching..."}
                          {currentPhase === "generating" && "Generating..."}
                        </span>
                      </motion.div>
                    )}
                    <RAGTypingIndicator />
                  </div>
                </motion.div>
              )}

              {/* ── Error State ── */}
              <AnimatePresence>
                {errorMessage && !isTyping && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.94, filter: "blur(4px)" }}
                    transition={springFloat}
                    className="flex flex-col items-center gap-4 py-6 px-4 text-center rounded-2xl bg-amber-500/[0.03] border border-amber-500/10"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/15">
                      <AnalyzeIcon className="h-6 w-6 text-amber-400/80" />
                    </div>
                    <p className="text-sm text-white/55 max-w-xs leading-relaxed">{errorMessage}</p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setErrorMessage(null)}
                      className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/70 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.1]"
                    >
                      Dismiss
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* ═══ SCROLL TO BOTTOM ═══ */}
            <AnimatePresence>
              {hasScrolledUp && messages.length > 0 && !isTyping && (
                <motion.button
                  initial={{ opacity: 0, y: 12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.9 }}
                  transition={springFloat}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.86 }}
                  onClick={scrollToBottom}
                  className="absolute z-20 bottom-28 left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] border border-white/[0.06] text-white/40 shadow-lg backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.1] hover:text-white/70"
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* ═══ QUICK ACTIONS ═══ */}
            <AnimatePresence>
              {messages.length > 0 && !isTyping && !errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={bezierQuick}
                  className="relative z-10 border-t border-white/[0.04] overflow-hidden"
                >
                  <div className="px-5 py-2.5">
                    <QuickActions onSelect={handleQuickAction} compact />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ═══ INPUT AREA — Glass Pill ═══ */}
            <div className="relative z-20 px-4 pb-4 pt-2 sm:px-5 sm:pb-5">
              <form onSubmit={handleSubmit}>
                {/* Double-bezel input */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-[4px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-within:border-violet-500/30 focus-within:bg-white/[0.04]">
                  <div className="flex items-end gap-2 rounded-[calc(1.125rem-4px)] bg-[#0A0A0A] px-4 py-2">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      placeholder="Type your message..."
                      className="flex-1 resize-none bg-transparent text-sm text-white/80 placeholder-white/20 outline-none py-1.5 leading-relaxed"
                      rows={1}
                    />
                    {/* Button-in-Button Send */}
                    <motion.button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.85 }}
                      className="group relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-white/[0.08] border border-white/[0.06] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-violet-500/20 hover:border-violet-500/30 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-white/[0.08] disabled:hover:border-white/[0.06]"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/0 to-indigo-600/0 group-hover:from-violet-500/20 group-hover:to-indigo-600/10 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" />
                      <Send className="relative h-4 w-4 text-white/50 group-hover:text-violet-300 group-hover:translate-x-[0.5px] group-hover:-translate-y-[0.5px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" />
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
