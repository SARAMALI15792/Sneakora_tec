"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRAG } from "@/components/rag/RAGProvider";
import { toast } from "sonner";
import {
  Send, Mail, MapPin, Phone,
  ChevronDown, MessageCircle, ArrowUpRight, Sparkles, Check,
  HeadphonesIcon, Building2, Megaphone, Handshake, Clock,
} from "lucide-react";

const springSnap = { type: "spring" as const, stiffness: 360, damping: 18, mass: 0.5 };
const springGentle = { type: "spring" as const, stiffness: 80, damping: 14, mass: 1.2 };
const cubicBez = { duration: 0.7, ease: [0.32, 0.72, 0, 1] as const };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] as const },
  },
};

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@sneakora.com", sub: "We reply within 24 hours", href: "mailto:hello@sneakora.com" },
  { icon: MapPin, label: "Location", value: "New York, NY", sub: "Headquarters" },
  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567", sub: "Mon-Fri 9AM-6PM EST", href: "tel:+15551234567" },
];

const socialLinks = [
  { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
  { label: "Twitter/X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { label: "YouTube", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
  { label: "GitHub", path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
];

const faqs = [
  { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping (2-3 business days) is available at checkout for an additional fee." },
  { q: "What is your return policy?", a: "We offer free returns within 30 days of delivery. Items must be unworn with original tags. Start your return from your account or contact support." },
  { q: "Do you ship internationally?", a: "Yes! We ship to over 50 countries. International delivery takes 7-14 business days. Duties and taxes may apply based on your location." },
  { q: "Can I change or cancel my order?", a: "Orders can be modified or cancelled within 1 hour of placement. After that, the order enters processing and cannot be changed." },
  { q: "Do you offer gift wrapping?", a: "Yes, we offer premium gift wrapping for $4.99. Add it at checkout along with a personalized message." },
];

const departments = [
  {
    icon: HeadphonesIcon, label: "Customer Support", desc: "Order issues, returns, exchanges, and general inquiries.",
    sub: "Response time: under 2 hours", action: "support",
  },
  {
    icon: Building2, label: "Sales & Partnerships", desc: "Bulk orders, wholesale inquiries, and brand collaborations.",
    sub: "Response time: under 4 hours", action: "sales",
  },
  {
    icon: Megaphone, label: "Press & Media", desc: "Press kits, interviews, features, and media partnerships.",
    sub: "Response time: under 8 hours", action: "press",
  },
  {
    icon: Handshake, label: "Careers", desc: "Job openings, internships, and career opportunities at Sneakora.",
    sub: "Response time: under 48 hours", action: "careers",
  },
];

const responseTimes = [
  { channel: "Email", time: "Within 24 hours", priority: "Standard" },
  { channel: "Live Chat", time: "Under 2 minutes", priority: "Instant" },
  { channel: "Phone", time: "Under 5 minutes", priority: "Priority" },
  { channel: "Social Media", time: "Within 2 hours", priority: "Standard" },
];

function DoubleBezel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-[1.5px] rounded-[1.75rem] sm:rounded-[2rem] bg-gradient-to-b from-white/[0.08] to-white/[0.02] ${className}`}>
      <div className="rounded-[calc(1.75rem-1.5px)] sm:rounded-[calc(2rem-1.5px)] bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] p-6 sm:p-10">
        {children}
      </div>
    </div>
  );
}

function NestedButton({
  children, onClick, disabled = false, loading = false, variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "ghost";
}) {
  const base = variant === "primary"
    ? "bg-white text-black hover:bg-white/90"
    : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] ring-1 ring-white/[0.06] hover:ring-white/[0.12]";
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`group relative inline-flex h-11 items-center gap-3 rounded-full px-6 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] disabled:opacity-40 ${base}`}
    >
      {children}
      <span className="inline-flex size-7 items-center justify-center rounded-full bg-black/[0.06] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:bg-black/[0.1]">
        <ArrowUpRight className="size-3.5" />
      </span>
    </motion.button>
  );
}

function EyebrowTag({ text }: { text: string }) {
  return (
    <motion.span
      variants={itemVariants}
      className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/30 ring-1 ring-white/[0.06]"
    >
      <span className="size-1 rounded-full bg-violet-400/60" />
      {text}
    </motion.span>
  );
}

function FAQItem({ question, answer, isOpen, onToggle, index }: {
  question: string; answer: string; isOpen: boolean; onToggle: () => void; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, ...cubicBez }}
      className="group border-b border-white/[0.06] last:border-0"
    >
      <button onClick={onToggle} className="flex w-full items-center justify-between py-5 px-2 text-left transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.02] rounded-xl">
        <span className="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors duration-500">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-white/30">
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
      <div className="grid transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <p className="px-2 pb-5 text-sm text-white/40 leading-relaxed">{answer}</p>
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
  const { setIsOpen: openRAG } = useRAG();
  const formRef = useRef<HTMLFormElement>(null);

  function scrollToForm(subject?: string) {
    if (subject) setForm((p) => ({ ...p, subject }));
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  }

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

  return (
    <div className="min-h-dvh bg-[#050505] text-white overflow-hidden">

      {/* ── Ambient Orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: [0.32, 0.72, 0, 1] }}
          className="absolute top-[15%] -left-[10%] w-[600px] h-[600px] rounded-full bg-violet-500/12 blur-[160px]" />
        <motion.div animate={{ x: [0, -25, 0], y: [0, 25, 0] }} transition={{ duration: 25, repeat: Infinity, ease: [0.32, 0.72, 0, 1], delay: 5 }}
          className="absolute bottom-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-cyan-400/8 blur-[140px]" />
        <motion.div animate={{ x: [0, 15, 0], y: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: [0.32, 0.72, 0, 1], delay: 2 }}
          className="absolute top-[55%] left-[30%] w-[400px] h-[400px] rounded-full bg-fuchsia-500/6 blur-[120px]" />
      </div>

      {/* ── Grain Overlay ── */}
      <div className="fixed inset-0 pointer-events-none z-[60] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative z-10 px-6 pt-32 pb-16 sm:pt-44 sm:pb-20">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto text-center">
          <EyebrowTag text="Get in Touch" />

          <motion.h1 variants={itemVariants} className="mt-6 text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.9]">
            <span className="text-white/90">Let&apos;s</span>
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-violet-200 bg-clip-text text-transparent">Talk</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-6 text-base sm:text-lg text-white/30 max-w-lg mx-auto leading-relaxed font-light">
            Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.
          </motion.p>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {[
              { label: "Live Chat", icon: MessageCircle, action: () => openRAG(true), primary: true },
              { label: "Get Support", icon: HeadphonesIcon, action: () => scrollToForm("Support request"), primary: false },
              { label: "Sales Inquiry", icon: Building2, action: () => scrollToForm("Sales inquiry"), primary: false },
              { label: "FAQ", icon: ChevronDown, action: () => document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" }), primary: false },
            ].map((item) => (
              <motion.button
                key={item.label} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}
                onClick={item.action}
                className={`group flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
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
      </section>

      {/* ═══════════════ WHY REACH OUT ═══════════════ */}
      <section className="relative z-10 px-6 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={cubicBez}
            className="text-center mb-14"
          >
            <EyebrowTag text="How to Reach Us" />
            <motion.h2 variants={itemVariants} className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight text-white/85">
              Choose Your
              <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent"> Department</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-3 text-sm text-white/30 max-w-md mx-auto">
              Select the team that best matches your inquiry and we&apos;ll route you to the right people.
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {departments.map((dept, i) => {
              const Icon = dept.icon;
              return (
                <motion.button
                  key={dept.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, ...cubicBez }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => scrollToForm(dept.label === "Careers" ? "Career inquiry" : `${dept.label} inquiry`)}
                  className="group text-left"
                >
                  <DoubleBezel>
                    <div className="flex items-start gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] group-hover:ring-violet-500/30 group-hover:bg-violet-500/10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                        <Icon className="h-5 w-5 text-white/40 group-hover:text-violet-400 transition-colors duration-500" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-white/80 tracking-tight">{dept.label}</h3>
                          <ArrowUpRight className="h-3.5 w-3.5 text-white/20 group-hover:text-violet-400 transition-colors duration-500 -translate-y-0.5" />
                        </div>
                        <p className="mt-1 text-sm text-white/30 leading-relaxed">{dept.desc}</p>
                        <span className="inline-block mt-2 text-[10px] uppercase tracking-[0.15em] font-medium text-violet-400/60 group-hover:text-violet-400 transition-colors duration-500">
                          {dept.sub}
                        </span>
                      </div>
                    </div>
                  </DoubleBezel>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ MAIN: CONTACT + FORM ═══════════════ */}
      <section className="relative z-10 px-6 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={cubicBez}
            className="text-center mb-14"
          >
            <EyebrowTag text="Contact Form" />
            <motion.h2 variants={itemVariants} className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight text-white/85">
              Send Us a
              <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent"> Message</span>
            </motion.h2>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-16">

            {/* ── Left: Contact Info ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={cubicBez}
              className="lg:col-span-2"
            >
              <DoubleBezel>
                <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-8">
                  <motion.p variants={itemVariants} className="text-[10px] uppercase tracking-[0.25em] text-white/15 font-medium">
                    Contact Information
                  </motion.p>

                  <div className="space-y-6">
                    {contactInfo.map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <motion.div key={item.label} variants={itemVariants} custom={i} className="group flex items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] group-hover:ring-violet-500/30 group-hover:bg-violet-500/10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                            <Icon className="h-4 w-4 text-white/40 group-hover:text-violet-400 transition-colors duration-500" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-medium mb-1">{item.label}</div>
                            {item.href ? (
                              <a href={item.href} className="text-base sm:text-lg font-semibold text-white/80 tracking-tight hover:text-violet-300 transition-colors duration-500">{item.value}</a>
                            ) : (
                              <div className="text-base sm:text-lg font-semibold text-white/80 tracking-tight">{item.value}</div>
                            )}
                            <div className="mt-0.5 text-xs text-white/25">{item.sub}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Social */}
                  <motion.div variants={itemVariants} className="pt-4 border-t border-white/[0.06]">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/15 font-medium mb-3">Follow Us</div>
                    <div className="flex gap-2.5">
                      {socialLinks.map((s) => (
                        <motion.a key={s.label} href="#" whileHover={{ scale: 1.12, y: -2 }} whileTap={{ scale: 0.9 }}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] text-white/30 hover:text-violet-300 hover:ring-violet-500/30 hover:bg-violet-500/10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                          aria-label={s.label}
                        >
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d={s.path} /></svg>
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </DoubleBezel>
            </motion.div>

            {/* ── Right: Form ── */}
            <motion.div
              id="contact-form"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ ...cubicBez, delay: 0.15 }}
              className="lg:col-span-3"
            >
              <DoubleBezel>
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                      transition={springGentle}
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
                        className="relative mb-8"
                      >
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-500/8">
                          <Check className="h-14 w-14 text-emerald-400" />
                        </motion.div>
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0 rounded-full bg-emerald-500/10 blur-3xl" />
                      </motion.div>
                      <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="text-3xl font-bold tracking-tight text-white/90">Message Sent!</motion.h3>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                        className="mt-4 text-sm text-white/35 max-w-xs leading-relaxed">
                        Thanks for reaching out. We&apos;ll get back to you within 24 hours.</motion.p>
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.94 }}
                        onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                        className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white/50 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-violet-500/30 hover:text-violet-300 active:scale-[0.97]"
                      >
                        <Send className="h-3.5 w-3.5" />Send Another
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.form key="form" ref={formRef} variants={containerVariants} initial="hidden" animate="visible"
                      onSubmit={handleSubmit} className="space-y-6"
                    >
                      <motion.p variants={itemVariants} className="text-[10px] uppercase tracking-[0.25em] text-white/15 font-medium">Send us a Message</motion.p>

                      <div className="grid sm:grid-cols-2 gap-5">
                        {["name", "email"].map((field) => (
                          <motion.div key={field} variants={itemVariants} className="group relative">
                            <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-white/20 mb-2.5">
                              {field === "name" ? "Name *" : "Email *"}
                            </label>
                            <div className="relative">
                              <input required type={field === "email" ? "email" : "text"} value={form[field as keyof typeof form]}
                                onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                                className="w-full h-12 px-5 text-sm bg-white/[0.02] border-b border-white/[0.08] outline-none focus:border-violet-400/40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] text-white/80 placeholder-white/15"
                                placeholder={field === "name" ? "Your name" : "you@example.com"}
                              />
                              <motion.div initial={false} animate={{ scaleX: form[field as keyof typeof form] ? 1 : 0, opacity: form[field as keyof typeof form] ? 1 : 0 }}
                                transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.4 }}
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 origin-left"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div variants={itemVariants} className="group relative">
                        <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-white/20 mb-2.5">Subject *</label>
                        <div className="relative">
                          <input required value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                            className="w-full h-12 px-5 text-sm bg-white/[0.02] border-b border-white/[0.08] outline-none focus:border-violet-400/40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] text-white/80 placeholder-white/15"
                            placeholder="How can we help?"
                          />
                          <motion.div initial={false} animate={{ scaleX: form.subject ? 1 : 0, opacity: form.subject ? 1 : 0 }}
                            transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.4 }}
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 origin-left"
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants} className="group relative">
                        <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-white/20 mb-2.5">Message *</label>
                        <div className="relative">
                          <textarea required rows={5} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                            className="w-full px-5 py-3.5 text-sm bg-white/[0.02] border-b border-white/[0.08] outline-none focus:border-violet-400/40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] text-white/80 placeholder-white/15 resize-none"
                            placeholder="Tell us what's on your mind..."
                          />
                          <motion.div initial={false} animate={{ scaleX: form.message ? 1 : 0, opacity: form.message ? 1 : 0 }}
                            transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.4 }}
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 origin-left"
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <motion.button type="submit" disabled={loading}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          className="group relative w-full h-14 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-widest transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-90 active:scale-[0.97] disabled:opacity-50 overflow-hidden flex items-center justify-center"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]" />
                          {loading ? (
                            <span className="relative z-10 flex items-center gap-2.5">
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              <span>Sending</span>
                            </span>
                          ) : (
                            <span className="relative z-10 flex items-center gap-3 pl-6 pr-2">
                              <span>Send Message</span>
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-black/15 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                                <Send className="h-3.5 w-3.5 text-black/60 group-hover:text-black/80 transition-colors duration-500" />
                              </span>
                            </span>
                          )}
                        </motion.button>
                      </motion.div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </DoubleBezel>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ RESPONSE TIMES ═══════════════ */}
      <section className="relative z-10 px-6 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={cubicBez}
            className="text-center mb-14"
          >
            <EyebrowTag text="Response Times" />
            <motion.h2 variants={itemVariants} className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight text-white/85">
              How Fast We
              <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent"> Respond</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-3 text-sm text-white/30 max-w-md mx-auto">
              We take your time seriously. Here&apos;s what you can expect across all our channels.
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {responseTimes.map((item, i) => (
              <motion.div
                key={item.channel}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, ...cubicBez }}
              >
                <DoubleBezel>
                  <div className="space-y-4 text-center">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${
                      item.priority === "Instant" ? "bg-emerald-500/10 ring-emerald-500/20" : item.priority === "Priority" ? "bg-violet-500/10 ring-violet-500/20" : "bg-white/[0.04] ring-white/[0.06]"
                    }`}>
                      <Clock className={`h-4 w-4 ${
                        item.priority === "Instant" ? "text-emerald-400" : item.priority === "Priority" ? "text-violet-400" : "text-white/40"
                      }`} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white/80 tracking-tight">{item.channel}</div>
                      <div className="mt-1 text-xs text-white/30">{item.time}</div>
                    </div>
                    <span className={`inline-block text-[9px] uppercase tracking-[0.2em] font-medium px-2.5 py-0.5 rounded-full ${
                      item.priority === "Instant" ? "bg-emerald-500/10 text-emerald-400/70" : item.priority === "Priority" ? "bg-violet-500/10 text-violet-400/70" : "bg-white/[0.04] text-white/30"
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                </DoubleBezel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ VISIT US ═══════════════ */}
      <section className="relative z-10 px-6 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={cubicBez}
            className="text-center mb-14"
          >
            <EyebrowTag text="Location" />
            <motion.h2 variants={itemVariants} className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight text-white/85">
              Visit Our
              <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent"> Studio</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-3 text-sm text-white/30 max-w-md mx-auto">
              We&apos;d love to meet you. Our doors are open Monday through Friday.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Map mockup */}
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={cubicBez}
            >
              <DoubleBezel>
                <div className="relative aspect-[4/3] rounded-[calc(1.75rem-1.5px)] overflow-hidden bg-gradient-to-br from-violet-500/5 via-indigo-500/5 to-cyan-500/5">
                  {/* Concentric rings map abstraction */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.08, 0.15] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-violet-500/10 blur-2xl" style={{ width: 320, height: 320, left: -160, top: -160 }} />
                      <div className="w-80 h-80 rounded-full border border-white/[0.06] flex items-center justify-center">
                        <div className="w-56 h-56 rounded-full border border-white/[0.04] flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full border border-white/[0.06] flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 flex items-center justify-center">
                              <MapPin className="h-6 w-6 text-violet-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-px bg-white/[0.03] absolute top-1/2" />
                        <div className="h-full w-px bg-white/[0.03] absolute left-1/2" />
                      </div>
                    </div>
                  </div>
                  {/* Label */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.06] px-4 py-3">
                    <div>
                      <div className="text-xs font-medium text-white/70">Sneakora HQ</div>
                      <div className="text-[10px] text-white/30 mt-0.5">245 Mercer Street, New York, NY</div>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-violet-400/60">Open 9AM-6PM</div>
                  </div>
                </div>
              </DoubleBezel>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.15, ...cubicBez }}
              className="space-y-6"
            >
              <DoubleBezel>
                <div className="space-y-6">
                  <motion.p variants={itemVariants} className="text-[10px] uppercase tracking-[0.25em] text-white/15 font-medium">
                    Studio Hours
                  </motion.p>

                  {[
                    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM EST" },
                    { day: "Saturday", hours: "10:00 AM - 4:00 PM EST" },
                    { day: "Sunday", hours: "Closed" },
                  ].map((item) => (
                    <div key={item.day} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                      <span className="text-sm text-white/60">{item.day}</span>
                      <span className={`text-xs font-medium ${item.hours === "Closed" ? "text-red-400/60" : "text-white/40"}`}>
                        {item.hours}
                      </span>
                    </div>
                  ))}

                  <div className="pt-2">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/15 font-medium mb-2">Parking</div>
                    <p className="text-sm text-white/30 leading-relaxed">Street parking available on Mercer Street. The nearest garage is at 250 Greene Street.</p>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/15 font-medium mb-2">Public Transit</div>
                    <p className="text-sm text-white/30 leading-relaxed">2 blocks from Broadway-Lafayette station (B, D, F, M trains). 5 min walk from Astor Place (6 train).</p>
                  </div>
                </div>
              </DoubleBezel>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section id="faq-section" className="relative z-10 px-6 pb-20 sm:pb-28">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={cubicBez}
            className="text-center mb-14"
          >
            <EyebrowTag text="Got Questions?" />
            <motion.h2 variants={itemVariants} className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight text-white/85">
              Frequently Asked
              <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent"> Questions</span>
            </motion.h2>
          </motion.div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 overflow-hidden">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} index={i} />
            ))}
          </div>

          {/* Live Chat CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2, ...cubicBez }}
            className="mt-14 text-center"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/25 to-indigo-600/25 blur-3xl scale-150" />
              <div className="relative rounded-[2rem] bg-white/[0.04] border border-white/[0.06] p-[5px]">
                <div className="relative rounded-[calc(2rem-5px)] bg-[#050505]/80 px-8 py-10 sm:px-12 backdrop-blur-xl">
                  <motion.div animate={{ scale: [1, 1.08, 1], rotate: [0, 3, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="flex justify-center mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
                      <MessageCircle className="h-6 w-6 text-violet-400" />
                    </div>
                  </motion.div>
                  <h3 className="text-lg font-bold text-white/85 tracking-tight">Need immediate help?</h3>
                  <p className="mt-2 text-sm text-white/35 max-w-md mx-auto leading-relaxed">
                    Our support team is available around the clock. Chat with us for instant answers.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.94 }}
                    onClick={() => openRAG(true)}
                    className="group/btn relative mt-6 inline-flex items-center gap-3 rounded-full bg-violet-600/15 border border-violet-500/25 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-violet-300 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-violet-600/25"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Start Live Chat
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:-translate-y-px group-hover/btn:translate-x-px">
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
