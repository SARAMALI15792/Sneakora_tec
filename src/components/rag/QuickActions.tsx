"use client";

interface QuickActionsProps {
  onSelect: (query: string) => void;
  compact?: boolean;
}

const QUICK_ACTIONS = [
  "What sneakers do you recommend?",
  "Show me your best sellers",
  "Any deals available?",
  "Help me find my size",
];

export function QuickActions({ onSelect, compact = false }: QuickActionsProps) {
  const actions = compact ? QUICK_ACTIONS.slice(0, 2) : QUICK_ACTIONS;

  return (
    <div className="mt-4 flex flex-wrap gap-2 justify-center">
      {actions.map((action) => (
        <button
          key={action}
          onClick={() => onSelect(action)}
          className="rounded-full bg-violet-600/10 text-violet-600 px-3 py-1.5 text-xs font-medium hover:bg-violet-600/20 transition-colors"
        >
          {action}
        </button>
      ))}
    </div>
  );
}