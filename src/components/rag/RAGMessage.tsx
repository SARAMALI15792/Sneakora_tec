"use client";

import { Clock } from "lucide-react";
import type { Message } from "./RAGProvider";
import { SneakoraLogoIcon } from "./RAGIcons";

interface RAGMessageProps {
  message: Message;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function RAGMessage({ message }: RAGMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} items-start`}>
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
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
          isUser
            ? "rounded-tr-md bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-sm shadow-violet-600/20"
            : "rounded-tl-md bg-white/[0.04] text-white/80 ring-1 ring-white/[0.04]"
        }`}
      >
        {message.content}
        <div className="mt-1.5 flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-white/15" />
          <span className="text-[10px] text-white/15">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}
