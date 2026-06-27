import type { SVGProps } from "react";

function IconContainer({
  children,
  ...props
}: SVGProps<SVGSVGElement> & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  );
}

export function AnalyzeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconContainer {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
      <path d="M11 8v6" opacity={0.5} />
      <path d="M8 11h6" opacity={0.5} />
    </IconContainer>
  );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconContainer {...props}>
      <circle cx="11" cy="11" r="6" />
      <path d="M16.5 16.5L20 20" />
      <path d="M11 7v8" opacity={0.4} />
      <path d="M7 11h8" opacity={0.4} />
    </IconContainer>
  );
}

export function DatabaseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconContainer {...props}>
      <ellipse cx="12" cy="6" rx="7" ry="2.5" />
      <path d="M5 6v5c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5V6" />
      <path d="M5 11v5c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5v-5" opacity={0.6} />
    </IconContainer>
  );
}

export function BrainIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconContainer {...props}>
      <path d="M12 3c-1.5 0-3 .8-3.5 2A4 4 0 006 8.5c-1.2.5-2 1.8-2 3.5 0 2 1.5 3.5 3.5 3.5h9c2 0 3.5-1.5 3.5-3.5 0-1.7-.8-3-2-3.5A4 4 0 0015.5 5C15 3.8 13.5 3 12 3z" />
      <path d="M8 14v3" opacity={0.5} />
      <path d="M16 14v3" opacity={0.5} />
      <path d="M12 14v4" opacity={0.5} />
    </IconContainer>
  );
}

export function TargetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconContainer {...props}>
      <circle cx="12" cy="12" r="9" opacity={0.25} />
      <circle cx="12" cy="12" r="6" opacity={0.5} />
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </IconContainer>
  );
}

export function SparkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconContainer {...props}>
      <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z" />
      <path d="M18 16l-.8 2.2L20 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8L18 16z" opacity={0.6} />
      <path d="M7 14l-.5 1.3L5 16l1.3.5L7 18l.5-1.5L9 16l-1.5-.7L7 14z" opacity={0.4} />
    </IconContainer>
  );
}

export function HistoryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconContainer {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </IconContainer>
  );
}

export function NewChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconContainer {...props}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h4" />
      <path d="M17 3v6" />
      <path d="M14 6h6" />
      <circle cx="18" cy="18" r="3" fill="currentColor" opacity={0.15} />
    </IconContainer>
  );
}

export function SneakoraLogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconContainer strokeWidth={1.5} {...props}>
      <path d="M4 8l8-5 8 5v8l-8 5-8-5V8z" />
      <path d="M12 3v18" opacity={0.3} />
      <path d="M4 8l8 5 8-5" opacity={0.5} />
    </IconContainer>
  );
}
