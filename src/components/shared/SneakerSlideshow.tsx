"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SNEAKER_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=85&auto=format",
    alt: "Premium sneakers - side view",
  },
  {
    src: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=85&auto=format",
    alt: "Premium sneakers - front view",
  },
  {
    src: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=85&auto=format",
    alt: "Premium sneakers - action shot",
  },
  {
    src: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=85&auto=format",
    alt: "Premium sneakers - style shot",
  },
  {
    src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=85&auto=format",
    alt: "Premium sneakers - red detail",
  },
];

const NUM_IMAGES = SNEAKER_IMAGES.length;
const ANGLE_STEP = 360 / NUM_IMAGES;
const RADIUS = 180;
const AUTO_ROTATE_INTERVAL = 4000;

export function SneakerSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragAngle, setDragAngle] = useState(0);
  const dragStartX = useRef(0);

  // Target rotation based on current index
  const targetRotation = -(currentIndex * ANGLE_STEP) + dragAngle;

  // Spring-based rotation for smooth physics
  const rotationSpring = useSpring(0, {
    stiffness: 80,
    damping: 18,
    mass: 0.8,
    restDelta: 0.1,
  });

  useEffect(() => {
    rotationSpring.set(targetRotation);
  }, [rotationSpring, targetRotation]);

  // Transform spring value to angle for CSS
  const rotation = useTransform(rotationSpring, (v) => v);

  const goTo = useCallback((index: number) => {
    setDragAngle(0);
    setCurrentIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setDragAngle(0);
    setCurrentIndex((prev) => (prev + 1) % NUM_IMAGES);
  }, []);

  const goPrev = useCallback(() => {
    setDragAngle(0);
    setCurrentIndex((prev) => (prev - 1 + NUM_IMAGES) % NUM_IMAGES);
  }, []);

  // Auto-rotate when idle
  useEffect(() => {
    if (isHovered || isDragging) return;
    const interval = setInterval(goNext, AUTO_ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, [goNext, isHovered, isDragging]);

  // Track drag for manual rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX.current;
    const angleDelta = (delta / 300) * ANGLE_STEP;
    setDragAngle(angleDelta);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Snap to nearest image if drag was significant
    if (Math.abs(dragAngle) > ANGLE_STEP * 0.3) {
      if (dragAngle > 0) goPrev();
      else goNext();
    } else {
      setDragAngle(0);
    }
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Carousel */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            rotateY: rotation,
            width: 0,
            height: 0,
          }}
        >
          {SNEAKER_IMAGES.map((image, index) => {
            const angle = index * ANGLE_STEP;
            const isActive = index === currentIndex;

            return (
              <motion.div
                key={image.src}
                className="absolute"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "visible",
                  width: 220,
                  height: 220,
                  marginLeft: -110,
                  marginTop: -110,
                }}
              >
                <div
                  className={`relative h-full w-full transition-all duration-500 ${
                    isActive ? "scale-110 opacity-100" : "scale-85 opacity-30"
                  }`}
                  style={{
                    backfaceVisibility: "visible",
                    filter: isActive ? "none" : "blur(2px) brightness(0.6)",
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 p-[2px]">
                    <div className="h-full w-full overflow-hidden rounded-[calc(1rem-2px)] bg-zinc-900">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-contain p-3"
                        priority={index < 2}
                        sizes="220px"
                        draggable={false}
                      />
                    </div>
                  </div>
                  {/* Reflection/shine overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Subtle gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/60 via-transparent to-zinc-950/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/30 pointer-events-none" />

      {/* Arrow controls */}
      <button
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-md transition-all hover:bg-white/20 hover:text-white active:scale-90 z-10"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-md transition-all hover:bg-white/20 hover:text-white active:scale-90 z-10"
        aria-label="Next image"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Indicator dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
        {SNEAKER_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.stopPropagation(); goTo(index); }}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentIndex
                ? "w-8 bg-white/90 shadow-lg shadow-white/20"
                : "w-2 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
