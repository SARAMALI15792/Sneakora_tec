import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60dvh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          404 — Page Not Found
        </p>
        <h1 className="font-heading mt-3 text-4xl font-bold tracking-tight">
          Lost your way?
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="group mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-foreground px-8 text-xs font-semibold uppercase tracking-[0.15em] text-background transition-all duration-500 hover:opacity-90 active:scale-[0.97]"
        >
          Go Home
          <span className="flex size-6 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5">
            <ArrowRight className="size-3" />
          </span>
        </Link>
      </div>
    </div>
  );
}