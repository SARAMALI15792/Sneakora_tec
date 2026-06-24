import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="pt-20 min-h-[60dvh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          404
        </p>
        <h1 className="font-heading mt-3 text-2xl font-bold">
          Product not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This product doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/shop"
          className="group mt-6 inline-flex h-10 items-center gap-2 rounded-full border border-border px-6 text-xs font-semibold uppercase tracking-widest transition-all hover:bg-muted active:scale-[0.98]"
        >
          <ArrowLeft className="size-3" />
          Back to Shop
        </Link>
      </div>
    </div>
  );
}