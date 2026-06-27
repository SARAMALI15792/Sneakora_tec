"use client";

interface QuickActionsProps {
  onSelect: (query: string) => void;
  compact?: boolean;
}

const QUICK_ACTIONS = [
  "What sneakers do you recommend for running?",
  "Show me your best sellers",
  "Any deals or discounts available?",
  "Help me find my size",
  "What are people saying about Air Pulse Max?",
  "Do you have anything under $100?",
  "What's your return policy?",
  "I need sneakers for the gym",
];

export function QuickActions({ onSelect, compact = false }: QuickActionsProps) {
  const actions = compact ? QUICK_ACTIONS.slice(0, 2) : QUICK_ACTIONS;

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "justify-start" : "justify-center"}`}>
      {actions.map((action) => (
        <button
          key={action}
          onClick={() => onSelect(action)}
          className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-white/50 transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300 active:scale-95"
        >
          {action}
        </button>
      ))}
    </div>
  );
}
