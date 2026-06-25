"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { generateId } from "@/lib/utils";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface RAGContextValue {
  messages: Message[];
  isOpen: boolean;
  isTyping: boolean;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  setIsOpen: (open: boolean) => void;
  setIsTyping: (typing: boolean) => void;
}

const RAGContext = createContext<RAGContextValue | null>(null);

export function RAGProvider({ children }: { children: ReactNode }) {
  const [messages, setMessagesState] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = useCallback(
    (message: Omit<Message, "id" | "timestamp">) => {
      const newMessage: Message = {
        ...message,
        id: generateId(),
        timestamp: new Date(),
      };
      setMessagesState((prev) => [...prev, newMessage]);
    },
    []
  );

  const setMessages = useCallback((msgs: Message[]) => {
    setMessagesState(msgs);
  }, []);

  const clearMessages = useCallback(() => {
    setMessagesState([]);
  }, []);

  return (
    <RAGContext.Provider
      value={{
        messages,
        isOpen,
        isTyping,
        addMessage,
        setMessages,
        clearMessages,
        setIsOpen,
        setIsTyping,
      }}
    >
      {children}
    </RAGContext.Provider>
  );
}

export function useRAG() {
  const context = useContext(RAGContext);
  if (!context) {
    throw new Error("useRAG must be used within a RAGProvider");
  }
  return context;
}