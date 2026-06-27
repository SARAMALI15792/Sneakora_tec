"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRAG } from "@/components/rag/RAGProvider";
import { toast } from "sonner";
import {
  Loader2, Send, CheckCircle, Mail, MapPin, Phone,
  ChevronDown, MessageCircle, ArrowUpRight, Sparkles, Globe,
} from "lucide-react";

const springFloat = { type: "spring" as const, stiffness: 120, damping: 18, mass: 0.9 };
const springSnap = { type: "spring" as const, stiffness: 360, damping: 18, mass: 0.5 };
const springGentle = { type: "spring" as const, stiffness: 80, damping: 14, mass: 1.2 };

const contactMethods = [
  { icon: Mail, label: "Email", value: "hello@sneakora.com", sub: "We reply within 24 hours", href: "mailto:hello@sneakora.com" },
  { icon: MapPin, label: "Location", value: "New York, NY", sub: "Headquarters" },
  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567", sub: "Mon-Fri 9AM-6PM EST", href: "tel:+15551234567" },
];

const faqs = [
  { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping (2-3 business days) is available at checkout for an additional fee." },
  { q: "What is your return policy?", a: "We offer free returns within 30 days of delivery. Items must be unworn with original tags. Start your return from your account or contact support." },
  { q: "Do you ship internationally?", a: "Yes! We ship to over 50 countries. International delivery takes 7-14 business days. Duties and taxes may apply based on your location." },
  { q: "Can I change or cancel my order?", a: "Orders can be modified or cancelled within 1 hour of placement. After that, the order enters processing and cannot be changed." },
  { q: "Do you offer gift wrapping?", a: "Yes, we offer premium gift wrapping for $4.99. Add it at checkout along with a personalized message." },
];

const socials = [
  { icon: Globe, label: "Instagram", href: "#", viewBox: "0 0 24 24", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
  { icon: Globe, label: "Twitter / X", href: "#", viewBox: "0 0 24 24", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { icon: Globe, label: "YouTube", href: "#", viewBox: "0 0 24 24", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
  { icon: Globe, label: "GitHub", href: "#", viewBox: "0 0 24 24", path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
];

function FloatingParticle() {
  const pos = useState(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 6 + Math.random() * 10,
    delay: Math.random() * 5,
  }))[0];

  return (
    <motion.div
      className="absolute rounded-full bg-gradient-to-br from-violet-400/20 to-indigo-400/10"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        width: pos.size,
        height: pos.size,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration: pos.duration,
        repeat: Infinity,
        delay: pos.delay,
        ease: "easeInOut",
      }}
      suppressHydrationWarning
    />
  );
}

function FAQItem({
  question, answer, isOpen, onToggle, index
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, ...springFloat }}
      className="group border-b border-white/[0.06] last:border-0"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 px-2 text-left transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.02] rounded-xl"
      >
        <span className="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors duration-500">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-white/30"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
      <div
        className="grid transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-2 pb-5 text-sm text-white/40 leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const { setIsOpen: openRAG } = useRAG();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const particles = Array.from({ length: 30 }, (_, i) => i);

  return (
    <div className="min-h-dvh bg-[#050505] text-white overflow-hidden">
      {/* ─── Animated Particle Background ─── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 -right-32 h-[600px] w-[600px] rounded-full bg-violet-500/10 blur-[180px]" />
        <div className="absolute -bottom-48 -left-32 h-[600px] w-[600px] rounded-full bg-indigo-500/6 blur-[180px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-violet-600/4 blur-[140px]" />
        {particles.map((i) => (
          <FloatingParticle key={i} />
        ))}
      </div>

      {/* ─── Hero Section ─── */}
      <section className="relative px-6 pt-32 pb-20 sm:pt-44 sm:pb-28">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ...springSnap }}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/20 font-medium"
            >
              <Sparkles className="h-3 w-3 text-violet-400/60" />
              Get in Touch
              <Sparkles className="h-3 w-3 text-violet-400/60" />
            </motion.span>
            <div className="mx-auto mt-3 h-px w-12 bg-white/[0.06]" />
            <h1 className="mt-8 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[0.95]">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                className="text-white/90"
              >
                Let&apos;s
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                className="bg-gradient-to-r from-violet-300 via-indigo-300 to-violet-200 bg-clip-text text-transparent"
              >
                Talk
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, ...springFloat }}
              className="mt-6 text-base sm:text-lg text-white/30 max-w-lg mx-auto leading-relaxed font-light"
            >
              Have a question, feedback, or just want to say hello?
              We&apos;d love to hear from you.
            </motion.p>

            {/* Quick action buttons — each scrolls to its section or opens RAG */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, ...springSnap }}
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
            >
              {[
                {
                  label: "Support",
                  icon: MessageCircle,
                  action: () => openRAG(true),
                  primary: true,
                },
                {
                  label: "Sales",
                  icon: Sparkles,
                  action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }),
                  primary: false,
                },
                {
                  label: "Press",
                  icon: ArrowUpRight,
                  action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }),
                  primary: false,
                },
              ].map((item) => (
                <motion.button
                  key={item.label}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={item.action}
                  className={`group flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    item.primary
                      ? "bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30"
                      : "border border-white/[0.06] bg-white/[0.03] text-white/40 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Contact Section ─── */}
      <section id="contact" className="relative px-6 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-16 lg:gap-20">

            {/* Left: Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={springFloat}
              className="lg:col-span-2 space-y-10"
            >
              {contactMethods.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, ...springFloat }}
                  >
                    {/* ── Double-Bezel card ── */}
                    <div className="group rounded-[1.5rem] bg-white/[0.03] border border-white/[0.06] p-1.5">
                      <div className="rounded-[calc(1.5rem-0.375rem)] bg-[#050505]/40 px-5 py-5">
                        <div className="flex items-start gap-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.06] group-hover:border-violet-500/30 group-hover:bg-violet-500/10 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                          >
                            <Icon className="h-5 w-5 text-white/40 group-hover:text-violet-400 transition-colors duration-500" />
                          </motion.div>
                          <div>
                            <div className="text-[10px] uppercase tracking-[0.25em] text-white/20 font-medium mb-1.5">
                              {item.label}
                            </div>
                            {item.href ? (
                              <a
                                href={item.href}
                                className="text-lg sm:text-xl font-semibold text-white/80 tracking-tight hover:text-violet-300 transition-colors duration-500"
                              >
                                {item.value}
                              </a>
                            ) : (
                              <div className="text-lg sm:text-xl font-semibold text-white/80 tracking-tight">
                                {item.value}
                              </div>
                            )}
                            <div className="mt-1 text-sm text-white/25 font-light">
                              {item.sub}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="pt-6"
              >
                <div className="rounded-[1.5rem] bg-white/[0.03] border border-white/[0.06] p-1.5">
                  <div className="rounded-[calc(1.5rem-0.375rem)] bg-[#050505]/40 px-5 py-5">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/15 font-medium mb-4">
                      Follow Us
                    </div>
                    <div className="flex gap-3">
                      {socials.map((social) => (
                        <motion.a
                          key={social.label}
                          href={social.href}
                          whileHover={{ scale: 1.12, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/30 hover:text-violet-300 hover:border-violet-500/30 hover:bg-violet-500/10 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                          aria-label={social.label}
                        >
                          <svg viewBox={social.viewBox} className="h-4 w-4" fill="currentColor">
                            <path d={social.path} />
                          </svg>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springFloat}
              className="lg:col-span-3"
            >
              {/* ── Double-Bezel Form Shell ── */}
              <div className="rounded-[2rem] bg-white/[0.03] border border-white/[0.06] p-2">
                <div className="rounded-[calc(2rem-0.5rem)] bg-[#050505]/60 px-6 py-8 sm:px-8">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                      transition={springGentle}
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
                        className="relative mb-8"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-500/8"
                        >
                          <CheckCircle className="h-14 w-14 text-emerald-400" />
                        </motion.div>
                        <motion.div
                          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0 rounded-full bg-emerald-500/10 blur-3xl"
                        />
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold tracking-tight text-white/90"
                      >
                        Message Sent!
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4 text-sm text-white/35 max-w-xs leading-relaxed"
                      >
                        Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                      </motion.p>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                        className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white/50 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-violet-500/30 hover:text-violet-300 active:scale-[0.97]"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Send Another
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      ref={formRef}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="grid sm:grid-cols-2 gap-5">
                        {["name", "email"].map((field) => (
                          <div
                            key={field}
                            className="group relative"
                            onMouseEnter={() => setHoveredField(field)}
                            onMouseLeave={() => setHoveredField(null)}
                          >
                            <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-white/20 mb-2.5">
                              {field === "name" ? "Name *" : "Email *"}
                            </label>
                            <div className="relative">
                              <input
                                required={field === "name"}
                                type={field === "email" ? "email" : "text"}
                                value={form[field as keyof typeof form]}
                                onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                                className="w-full h-12 px-5 text-sm bg-white/[0.02] border-b border-white/[0.08] outline-none focus:border-violet-400/40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] text-white/80 placeholder-white/15"
                                placeholder={field === "name" ? "Your name" : "you@example.com"}
                              />
                              <motion.div
                                initial={false}
                                animate={{
                                  scaleX: hoveredField === field || form[field as keyof typeof form] ? 1 : 0,
                                  opacity: hoveredField === field || form[field as keyof typeof form] ? 1 : 0,
                                }}
                                transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.4 }}
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 origin-left"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div
                        className="group relative"
                        onMouseEnter={() => setHoveredField("subject")}
                        onMouseLeave={() => setHoveredField(null)}
                      >
                        <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-white/20 mb-2.5">
                          Subject *
                        </label>
                        <div className="relative">
                          <input
                            required
                            value={form.subject}
                            onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                            className="w-full h-12 px-5 text-sm bg-white/[0.02] border-b border-white/[0.08] outline-none focus:border-violet-400/40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] text-white/80 placeholder-white/15"
                            placeholder="How can we help?"
                          />
                          <motion.div
                            initial={false}
                            animate={{
                              scaleX: hoveredField === "subject" || form.subject ? 1 : 0,
                              opacity: hoveredField === "subject" || form.subject ? 1 : 0,
                            }}
                            transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.4 }}
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 origin-left"
                          />
                        </div>
                      </div>

                      <div
                        className="group relative"
                        onMouseEnter={() => setHoveredField("message")}
                        onMouseLeave={() => setHoveredField(null)}
                      >
                        <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-white/20 mb-2.5">
                          Message *
                        </label>
                        <div className="relative">
                          <textarea
                            required
                            rows={5}
                            value={form.message}
                            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                            className="w-full px-5 py-3.5 text-sm bg-white/[0.02] border-b border-white/[0.08] outline-none focus:border-violet-400/40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] text-white/80 placeholder-white/15 resize-none"
                            placeholder="Tell us what's on your mind..."
                          />
                          <motion.div
                            initial={false}
                            animate={{
                              scaleX: hoveredField === "message" || form.message ? 1 : 0,
                              opacity: hoveredField === "message" || form.message ? 1 : 0,
                            }}
                            transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.4 }}
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 origin-left"
                          />
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="group relative w-full h-14 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-widest transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-90 active:scale-[0.97] disabled:opacity-50 overflow-hidden flex items-center justify-center"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]" />
                        {loading ? (
                          <span className="relative z-10 flex items-center gap-2.5">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Sending</span>
                          </span>
                        ) : (
                          <span className="relative z-10 flex items-center gap-3 pl-6 pr-2">
                            <span>Send Message</span>
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/10 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-black/15 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                              <Send className="h-3.5 w-3.5 text-black/60 group-hover:text-black/80 transition-colors duration-500" />
                            </span>
                          </span>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="relative px-6 pb-32">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springFloat}
            className="text-center mb-16"
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/20 font-medium">
              Got Questions?
            </span>
            <div className="mx-auto mt-3 h-px w-12 bg-white/[0.06]" />
            <h2 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight text-white/85">
              Frequently Asked
              <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent"> Questions</span>
            </h2>
          </motion.div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 overflow-hidden">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.q}
                answer={faq.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                index={i}
              />
            ))}
          </div>

          {/* Live Chat CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, ...springGentle }}
            className="mt-16 text-center"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/25 to-indigo-600/25 blur-3xl scale-150" />
              <div className="relative rounded-[2rem] bg-white/[0.04] border border-white/[0.06] p-[5px]">
                <div className="relative rounded-[calc(2rem-5px)] bg-[#050505]/80 px-10 py-12 sm:px-14 backdrop-blur-xl">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="flex justify-center mb-5"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-violet-500/10 border border-violet-500/20">
                      <MessageCircle className="h-7 w-7 text-violet-400" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold text-white/85 tracking-tight">
                    Need immediate help?
                  </h3>
                  <p className="mt-2.5 text-sm text-white/35 max-w-md mx-auto leading-relaxed">
                    Our support team is available around the clock. Chat with us for instant answers.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => openRAG(true)}
                    className="group/btn relative mt-8 inline-flex items-center gap-3 rounded-full bg-violet-600/15 border border-violet-500/25 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-violet-300 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-violet-600/25"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Start Live Chat
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:-translate-y-px group-hover/btn:translate-x-px">
                      <ArrowUpRight className="h-3.5 w-3.5 text-violet-400" />
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
