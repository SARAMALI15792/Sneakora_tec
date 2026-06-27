"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { generateId } from "@/lib/utils";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface RAGContextValue {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  isOpen: boolean;
  isTyping: boolean;
  streamingStatus: string | null;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  appendToLastMessage: (text: string) => void;
  clearMessages: () => void;
  setIsOpen: (open: boolean) => void;
  setIsTyping: (typing: boolean) => void;
  setStreamingStatus: (status: string | null) => void;
  startNewConversation: () => void;
  switchConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, name: string) => void;
}

const RAGContext = createContext<RAGContextValue | null>(null);

const STORAGE_KEY = "sneakora-chat-history";

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((c: Record<string, unknown>) => ({
      ...c,
      messages: (c.messages as Record<string, unknown>[]).map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp as string),
      })),
      createdAt: new Date(c.createdAt as string),
      updatedAt: new Date(c.updatedAt as string),
    }));
  } catch {
    return [];
  }
}

function saveConversations(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // Storage full or unavailable
  }
}

function generateConversationName(messages: Message[]): string {
  const firstUserMsg = messages.find((m) => m.role === "user");
  if (!firstUserMsg) return "New Chat";
  const text = firstUserMsg.content.slice(0, 40);
  return text.length < firstUserMsg.content.length ? text + "..." : text;
}

export function RAGProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingStatus, setStreamingStatus] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loaded = loadConversations();
    setConversations(loaded);
    if (loaded.length > 0) {
      setActiveConversationId(loaded[0].id);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      saveConversations(conversations);
    }
  }, [conversations, initialized]);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );
  const messages = activeConversation?.messages ?? [];

  const updateConversation = useCallback(
    (convId: string, updater: (conv: Conversation) => Conversation) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? updater(c) : c))
      );
    },
    []
  );

  const addMessage = useCallback(
    (message: Omit<Message, "id" | "timestamp">) => {
      const newMessage: Message = {
        ...message,
        id: generateId(),
        timestamp: new Date(),
      };
      setConversations((prev) => {
        const existing = prev.find((c) => c.id === activeConversationId);
        if (!existing) return prev;
        return prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                messages: [...c.messages, newMessage],
                updatedAt: new Date(),
                name: generateConversationName([
                  ...c.messages,
                  newMessage,
                ]),
              }
            : c
        );
      });
    },
    [activeConversationId]
  );

  const appendToLastMessage = useCallback(
    (text: string) => {
      setConversations((prev) => {
        const existing = prev.find((c) => c.id === activeConversationId);
        if (!existing || existing.messages.length === 0) return prev;
        const last = existing.messages[existing.messages.length - 1];
        if (last.role !== "assistant") return prev;
        return prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                messages: c.messages.map((m, i) =>
                  i === c.messages.length - 1
                    ? { ...m, content: m.content + text }
                    : m
                ),
                updatedAt: new Date(),
              }
            : c
        );
      });
    },
    [activeConversationId]
  );

  const clearMessages = useCallback(() => {
    updateConversation(activeConversationId!, (c) => ({
      ...c,
      messages: [],
      updatedAt: new Date(),
    }));
  }, [activeConversationId, updateConversation]);

  const startNewConversation = useCallback(() => {
    const newConv: Conversation = {
      id: generateId(),
      name: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
  }, []);

  const switchConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (id === activeConversationId) {
        const next = filtered[0] ?? null;
        setActiveConversationId(next?.id ?? null);
      }
      return filtered;
    });
  }, [activeConversationId]);

  const renameConversation = useCallback((id: string, name: string) => {
    updateConversation(id, (c) => ({ ...c, name }));
  }, [updateConversation]);

  return (
    <RAGContext.Provider
      value={{
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
        renameConversation,
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
