"use client";

import { User, Bot } from "lucide-react";
import type { Message } from "./RAGProvider";

interface RAGMessageProps {
  message: Message;
}

export function RAGMessage({ message }: RAGMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-violet-600 text-white"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
          isUser ? "bg-violet-600 text-white" : "bg-muted"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}