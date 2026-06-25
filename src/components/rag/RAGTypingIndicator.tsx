"use client";

export function RAGTypingIndicator() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full bg-violet-500/60 animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="h-2 w-2 rounded-full bg-violet-500/60 animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="h-2 w-2 rounded-full bg-violet-500/60 animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}
