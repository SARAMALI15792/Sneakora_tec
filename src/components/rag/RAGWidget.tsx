"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Bot, User } from "lucide-react";
import { useRAG, type Message } from "./RAGProvider";
import { RAGTypingIndicator } from "./RAGTypingIndicator";
import { QuickActions } from "./QuickActions";
import { generateId } from "@/lib/utils";

export function RAGWidget() {
  const { messages, isOpen, isTyping, addMessage, setIsOpen, setIsTyping } =
    useRAG();
  const [input, setInput] = useState("");
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent, query?: string) => {
    e.preventDefault();
    const finalQuery = query || input.trim();
    if (!finalQuery || isTyping) return;

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

    try {
      const response = await fetch("/api/rag/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: finalQuery,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

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
                if (data.text) {
                  addMessage({
                    role: "assistant",
                    content: data.text,
                  });
                  fullResponse += data.text;
                }
                if (data.done && data.fullResponse) {
                  fullResponse = data.fullResponse;
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: fullResponse },
      ]);
    } catch (error) {
      console.error("Error:", error);
      addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (query: string) => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent, query);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-700 transition-all hover:scale-105"
        aria-label="Open AI Assistant"
      >
        <Bot className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-96 flex-col rounded-2xl bg-background border border-border/50 shadow-2xl">
      <div className="flex items-center justify-between rounded-t-2xl bg-violet-600 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <span className="font-semibold">Sneakora AI</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-full p-1 hover:bg-violet-700 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Bot className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Welcome! How can I help you today?</p>
            <QuickActions onSelect={handleQuickAction} />
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                message.role === "user"
                  ? "bg-violet-600 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {message.role === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                message.role === "user"
                  ? "bg-violet-600 text-white"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-muted rounded-2xl px-4 py-2">
              <RAGTypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length > 0 && (
        <div className="border-t border-border/50 p-3">
          <QuickActions onSelect={handleQuickAction} compact />
        </div>
      )}

      <form onSubmit={handleSubmit} className="border-t border-border/50 p-3">
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
            placeholder="Ask me anything..."
            className="flex-1 resize-none rounded-xl border border-border/50 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50"
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}