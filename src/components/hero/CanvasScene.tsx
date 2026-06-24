"use client";

import Image from "next/image";

export function CanvasScene() {
  return (
    <div className="h-full w-full overflow-hidden relative bg-[#1a1714] flex items-center justify-center">
      {/* Editorial photo */}
      <Image
        src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=85&auto=format"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Warm editorial overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1714]/60 via-transparent to-[#1a1714]/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/50 via-transparent to-[#1a1714]/30" />

      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "96px 96px",
        }}
      />
    </div>
  );
}
