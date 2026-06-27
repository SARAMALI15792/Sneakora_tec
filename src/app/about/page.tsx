"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const springFloat = { type: "spring" as const, stiffness: 120, damping: 18, mass: 0.9 };
const bezierSlow = { ease: [0.32, 0.72, 0, 1] as const, duration: 0.9 };
const bezierMed = { ease: [0.32, 0.72, 0, 1] as const, duration: 0.6 };

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 60, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: springFloat },
};

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "10K+", label: "Products Curated" },
  { value: "500+", label: "Brands Partnered" },
  { value: "4.9", label: "Average Rating" },
];

const timeline = [
  { year: "2020", title: "Founded in NYC", desc: "Two sneakerheads with a mission to fix online sneaker shopping." },
  { year: "2021", title: "10K Pairs Shipped", desc: "First major milestone. Community growing fast." },
  { year: "2022", title: "Brand Partnerships", desc: "Official partnerships with Nike, Adidas, New Balance & more." },
  { year: "2023", title: "Global Shipping", desc: "Expanded to 50+ countries. 500K+ customers." },
  { year: "2024", title: "AI Shopping", desc: "Launched Sneakora AI — your personal sneaker stylist." },
  { year: "2025+", title: "The Future", desc: "Building the most trusted sneaker marketplace." },
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -120]);

  return (
    <div className="min-h-dvh bg-[#050505] text-white overflow-hidden">

      {/* ─── Hero ─── */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex items-center justify-center px-6 py-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-48 -right-32 h-[600px] w-[600px] rounded-full bg-violet-500/12 blur-[180px]" />
          <div className="absolute -bottom-48 -left-32 h-[600px] w-[600px] rounded-full bg-indigo-500/8 blur-[180px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[120px]" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative max-w-5xl mx-auto text-center"
        >
          <motion.div variants={fadeUp} className="mb-8">
            <span className="inline-block text-[11px] uppercase tracking-[0.3em] text-white/25 font-medium">
              About Sneakora
            </span>
            <div className="mx-auto mt-3 h-px w-12 bg-white/[0.08]" />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9]"
          >
            <span className="text-white/90">More Than</span>
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-violet-200 bg-clip-text text-transparent">
              Sneakers
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 text-lg sm:text-xl text-white/30 max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
          >
            We curate the world&apos;s most premium sneakers. Every pair authenticated.
            Every collection intentional. Every customer part of the culture.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-12 flex items-center justify-center gap-5">
            <Link
              href="/shop"
              className="group relative inline-flex items-center gap-3 rounded-full bg-white px-9 py-4 text-sm font-semibold text-black transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] active:scale-[0.97]"
            >
              Explore Collection
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/8 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full px-9 py-4 text-sm font-medium text-white/50 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white/80 active:scale-[0.97]"
            >
              Get in Touch
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Stats — Inline minimal ─── */}
      <section className="px-6 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.1, ...springFloat }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold tracking-tight text-white/90">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs text-white/25 uppercase tracking-[0.2em] font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Story — Editorial Split ─── */}
      <section className="px-6 py-28 sm:py-40">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-120px" }}
              transition={bezierSlow}
            >
              <span className="text-[11px] uppercase tracking-[0.3em] text-white/20 font-medium">
                Our Story
              </span>
              <div className="mt-4 h-px w-12 bg-white/[0.06]" />
              <h2 className="mt-8 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.02]">
                Born from a{" "}
                <span className="text-white/50">passion</span> for
                sneaker culture.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ ...bezierSlow, delay: 0.1 }}
              className="space-y-6 text-sm sm:text-base text-white/35 leading-relaxed font-light"
            >
              <p>
                Sneakora started in 2020 when our founders realized finding authentic, 
                premium sneakers online was harder than it should be. Too many fakes, 
                too little curation, and a shopping experience that didn&apos;t match 
                the excitement of sneaker culture.
              </p>
              <p>
                Today, we partner with top brands and independent designers to bring you 
                collections that push boundaries. From court to street, from retro classics 
                to futuristic silhouettes — every pair tells a story.
              </p>
              <p>
                We&apos;re building more than a store. We&apos;re building a community of 
                collectors, athletes, and believers who know the right pair of sneakers 
                can change everything.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Timeline — Vertical editorial ─── */}
      <section className="px-6 py-28 sm:py-40 relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-violet-500/6 blur-[150px]" />
        </div>
        <div className="max-w-3xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={bezierMed}
            className="mb-20 text-center"
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/20 font-medium">
              Our Journey
            </span>
            <div className="mx-auto mt-3 h-px w-12 bg-white/[0.06]" />
            <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white/85">
              The Road So Far
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-transparent" />
            <div className="space-y-16">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -30, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.08, ...bezierMed }}
                  className="relative pl-14"
                >
                  <div className="absolute left-[11px] top-[6px] h-[18px] w-[18px] rounded-full bg-white/[0.04] border border-white/[0.1] flex items-center justify-center">
                    <div className="h-[6px] w-[6px] rounded-full bg-violet-400/60" />
                  </div>
                  <div className="text-xs font-bold text-violet-400/60 uppercase tracking-widest mb-1.5">
                    {item.year}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white/80 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-white/30 leading-relaxed max-w-lg">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Values — Minimal grid ─── */}
      <section className="px-6 py-28 sm:py-40">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={bezierMed}
            className="mb-20 text-center"
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/20 font-medium">
              Why Sneakora
            </span>
            <div className="mx-auto mt-3 h-px w-12 bg-white/[0.06]" />
            <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white/85">
              Built different. On purpose.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
            {[
              { title: "Authenticity", desc: "Every pair verified authentic. Sourced directly from brands and authorized distributors." },
              { title: "Free Shipping", desc: "Free shipping on orders over $100. Most orders arrive within 3-5 business days." },
              { title: "30-Day Returns", desc: "Not the right fit? Return any unworn sneakers within 30 days for a full refund." },
              { title: "24/7 Support", desc: "Sneaker experts available around the clock to help you find the perfect pair." },
              { title: "Instant Checkout", desc: "One-click checkout with saved preferences. In and out in under 30 seconds." },
              { title: "Early Access", desc: "Members get first dibs on limited drops, collabs, and exclusive colorways." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06, ...springFloat }}
                className="p-8 sm:p-10 bg-[#050505]"
              >
                <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white/80 tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-white/30 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA — Minimal ─── */}
      <section className="px-6 py-28 sm:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={bezierSlow}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-[11px] uppercase tracking-[0.3em] text-white/20 font-medium">
            Get Started
          </span>
          <div className="mx-auto mt-3 h-px w-12 bg-white/[0.06]" />
          <h2 className="mt-8 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white/85">
            Ready to find your perfect pair?
          </h2>
          <p className="mt-5 text-sm sm:text-base text-white/30 max-w-md mx-auto leading-relaxed font-light">
            Explore our curated collections and join thousands of satisfied customers 
            who found their perfect fit.
          </p>
          <Link
            href="/shop"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-9 py-4 text-sm font-semibold text-black transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] active:scale-[0.97]"
          >
            Shop Now
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/8 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
