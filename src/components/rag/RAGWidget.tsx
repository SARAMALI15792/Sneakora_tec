"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  X, Send, ChevronDown, Trash2, MessageSquare,
  Clock, Plus, ChevronRight, PanelLeftClose,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRAG, type Message } from "./RAGProvider";
import { RAGTypingIndicator } from "./RAGTypingIndicator";
import { QuickActions } from "./QuickActions";
import { generateId } from "@/lib/utils";
import {
  AnalyzeIcon, SearchIcon, DatabaseIcon, BrainIcon,
  TargetIcon, SparkIcon, HistoryIcon, NewChatIcon, SneakoraLogoIcon,
} from "./RAGIcons";

const springConfig = {
  type: "spring" as const,
  duration: 0.5,
  bounce: 0.15,
};

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

const statusIcons: Record<string, React.ReactNode> = {
  "Analyzing": <AnalyzeIcon className="h-4 w-4" />,
  "Searching": <DatabaseIcon className="h-4 w-4" />,
  "Finding": <TargetIcon className="h-4 w-4" />,
  "Generating": <BrainIcon className="h-4 w-4" />,
};

function getStatusIcon(status: string | null): React.ReactNode {
  if (!status) return <SparkIcon className="h-4 w-4" />;
  const key = Object.keys(statusIcons).find((k) => status.startsWith(k));
  return key ? statusIcons[key] : <SparkIcon className="h-4 w-4" />;
}

export function RAGWidget() {
  const {
    conversations,
    activeConversationId,
    messages,
    isOpen,
    isTyping,
    streamingStatus,
    addMessage,
    appendToLastMessage,
    clearMessages,
    setIsOpen,
    setIsTyping,
    setStreamingStatus,
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
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [hasScrolledUp, setHasScrolledUp] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!hasScrolledUp) scrollToBottom();
  }, [messages, isTyping, streamingStatus, hasScrolledUp]);

  const handleScroll = () => {
    const el = messagesEndRef.current?.parentElement;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setHasScrolledUp(!isNearBottom);
  };

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
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
    setConversationHistory((prev) => [
      ...prev,
      { role: "user", content: finalQuery },
    ]);
    setInput("");
    setIsTyping(true);
    setStreamingStatus("Analyzing your query...");

    let isFirstChunk = true;

    try {
      const response = await fetch("/api/rag/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: finalQuery,
          conversationHistory,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "status") {
                  setStreamingStatus(data.text);
                  continue;
                }
                if (data.type === "error") {
                  setErrorMessage(data.text);
                  setIsTyping(false);
                  setStreamingStatus(null);
                  return;
                }
                if (data.text) {
                  setStreamingStatus(null);
                  if (isFirstChunk) {
                    isFirstChunk = false;
                    addMessage({ role: "assistant", content: data.text });
                  } else {
                    appendToLastMessage(data.text);
                  }
                  fullResponse += data.text;
                }
                if (data.done) {
                  if (data.fullResponse) fullResponse = data.fullResponse;
                  isFirstChunk = true;
                }
              } catch {
                // skip invalid JSON
              }
            }
          }
        }
      }

      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: fullResponse },
      ]);
    } catch {
      setErrorMessage("Connection error. Please check your internet and try again.");
    } finally {
      setIsTyping(false);
      setStreamingStatus(null);
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

  // Close button (floating)
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(true)}
        className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-600/30 transition-shadow hover:shadow-2xl hover:shadow-violet-600/40"
        aria-label="Open AI Assistant"
      >
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-violet-600/20 animate-ping" />
          <SneakoraLogoIcon className="h-6 w-6 relative" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
        </span>
      </motion.button>
    );
  }

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={springConfig}
      className="fixed bottom-0 right-0 z-50 flex h-[100dvh] w-full flex-col overflow-hidden bg-gradient-to-b from-zinc-900/98 to-zinc-950/98 backdrop-blur-2xl shadow-2xl shadow-black/60 sm:bottom-4 sm:right-4 sm:h-[620px] sm:w-[440px] sm:rounded-2xl sm:border sm:border-white/[0.06]"
    >
      {/* --- HEADER --- */}
      <div className="relative flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-600/30">
            <SneakoraLogoIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-white/90">Sneakora AI</span>
            {activeConv && messages.length > 0 && (
              <p className="text-[10px] text-white/30 truncate max-w-[120px] sm:max-w-[200px]">
                {activeConv.name}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleNewChat}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/60 active:scale-90"
            aria-label="New conversation"
          >
            <Plus className="h-4 w-4" />
          </button>
          {conversations.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:bg-white/[0.06] active:scale-90 ${
                showHistory ? "bg-white/[0.08] text-white/60" : "text-white/30 hover:text-white/60"
              }`}
              aria-label="Conversation history"
            >
              <HistoryIcon className="h-4 w-4" />
            </button>
          )}
          {messages.length > 0 && (
            <button
              onClick={() => { clearMessages(); setErrorMessage(null); }}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/60 active:scale-90"
              aria-label="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/60 active:scale-90"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* --- HISTORY PANEL --- */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-b border-white/[0.06]"
          >
            <div className="px-3 py-3 space-y-1 max-h-[220px] overflow-y-auto">
              <p className="text-[10px] uppercase tracking-widest text-white/20 px-2 pb-1">
                Conversations ({conversations.length})
              </p>
              {conversations.map((conv) => (
                <motion.button
                  key={conv.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => handleSwitchConv(conv.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all active:scale-[0.98] ${
                    conv.id === activeConversationId
                      ? "bg-white/[0.08] text-white/80"
                      : "text-white/40 hover:bg-white/[0.04] hover:text-white/60"
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1 truncate text-xs">{conv.name}</span>
                  <span className="text-[10px] text-white/20 shrink-0">
                    {conv.messages.length}
                  </span>
                  <button
                    onClick={(e) => handleDeleteConv(e, conv.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg text-white/10 hover:text-white/40 hover:bg-white/[0.06]"
                    aria-label="Delete conversation"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.button>
              ))}
              <button
                onClick={handleNewChat}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-violet-400/70 hover:text-violet-400 hover:bg-white/[0.04] transition-all"
              >
                <NewChatIcon className="h-3.5 w-3.5" />
                Start new conversation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MESSAGES --- */}
      <div
        className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-hide sm:px-5"
        onScroll={handleScroll}
      >
        {messages.length === 0 && !isTyping && !errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center h-full text-center px-4"
          >
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500/15 to-indigo-600/15 ring-1 ring-violet-500/10">
              <MessageSquare className="h-8 w-8 text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold text-white/90">How can I help you?</h3>
            <p className="mt-2 text-sm text-white/40 max-w-xs leading-relaxed">
              Ask about our products, your orders, or get style recommendations.
            </p>
            <div className="mt-8 w-full max-w-sm">
              <QuickActions onSelect={handleQuickAction} />
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message, idx) => {
            const isUser = message.role === "user";
            const isLast = idx === messages.length - 1;
            const streaming = isLast && isTyping && !isUser;

            // Date separator
            const showDate =
              idx === 0 ||
              formatDate(messages[idx - 1].timestamp) !== formatDate(message.timestamp);

            return (
              <React.Fragment key={message.id}>
                {showDate && (
                  <div className="flex items-center gap-3 py-1">
                    <div className="flex-1 h-px bg-white/[0.04]" />
                    <span className="text-[10px] text-white/20 font-medium uppercase tracking-wider">
                      {formatDate(message.timestamp)}
                    </span>
                    <div className="flex-1 h-px bg-white/[0.04]" />
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                      isUser
                        ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-sm shadow-violet-600/30"
                        : "bg-white/[0.06] text-white/40 ring-1 ring-white/[0.06]"
                    }`}
                  >
                    {isUser ? (
                      <span className="text-xs font-bold">
                        {message.content.charAt(0).toUpperCase() || "U"}
                      </span>
                    ) : (
                      <SneakoraLogoIcon className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] ${
                      isUser
                        ? "rounded-2xl rounded-tr-md bg-gradient-to-br from-violet-600 to-indigo-700 px-4 py-2.5 text-sm text-white shadow-sm shadow-violet-600/20"
                        : message.content
                        ? "rounded-2xl rounded-tl-md bg-white/[0.04] px-4 py-2.5 text-sm text-white/80 ring-1 ring-white/[0.04]"
                        : ""
                    }`}
                  >
                    {message.content || (streaming ? <RAGTypingIndicator /> : null)}
                    {message.content && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-white/15" />
                        <span className="text-[10px] text-white/15">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </AnimatePresence>

        {/* Streaming status bar */}
        <AnimatePresence>
          {streamingStatus && isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-3 px-1 py-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 ring-1 ring-violet-500/20">
                {getStatusIcon(streamingStatus)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white/70">{streamingStatus}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[11px] text-white/30">Processing...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Typing indicator for empty assistant messages */}
        {isTyping && !streamingStatus && messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1]?.content === "" && (
          <div className="flex gap-3 items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-white/40 ring-1 ring-white/[0.06]">
              <SneakoraLogoIcon className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-tl-md bg-white/[0.04] px-4 py-3 ring-1 ring-white/[0.04]">
              <RAGTypingIndicator />
            </div>
          </div>
        )}

        {/* Error message */}
        <AnimatePresence>
          {errorMessage && !isTyping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-3 py-4 px-3 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
                <AnalyzeIcon className="h-6 w-6 text-amber-400" />
              </div>
              <p className="text-sm text-white/60 max-w-xs">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage(null)}
                className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/70 transition-all hover:bg-white/[0.1] active:scale-95"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom */}
      <AnimatePresence>
        {hasScrolledUp && messages.length > 0 && !isTyping && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-white/50 shadow-lg backdrop-blur-sm transition-all hover:bg-white/[0.12] hover:text-white/80"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Quick actions after messages */}
      <AnimatePresence>
        {messages.length > 0 && !isTyping && !errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/[0.06] px-4 py-2.5 sm:px-5"
          >
            <QuickActions onSelect={handleQuickAction} compact />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- INPUT --- */}
      <form onSubmit={handleSubmit} className="border-t border-white/[0.06] p-4 sm:p-5">
        <div className="flex gap-2">
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
            className="flex-1 resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/80 placeholder-white/25 outline-none transition-all duration-200 focus:border-violet-500/40 focus:bg-white/[0.05] focus:ring-1 focus:ring-violet-500/15"
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center self-end rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-600/25 transition-all duration-200 hover:from-violet-400 hover:to-indigo-500 hover:shadow-violet-600/40 disabled:opacity-25 disabled:cursor-not-allowed active:scale-90"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
