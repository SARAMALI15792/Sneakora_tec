"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, damping: 20, stiffness: 100 } },
  };

  return (
    <div className="min-h-dvh px-6 py-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
            Get in Touch
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Contact Us</h1>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            {[
              { icon: Mail, title: "Email", detail: "hello@sneakora.com" },
              { icon: MapPin, title: "Location", detail: "New York, NY" },
              { icon: Phone, title: "Phone", detail: "+1 (555) 123-4567" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card">
                <div className="size-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <item.icon className="size-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">{item.title}</p>
                  <p className="text-sm font-medium mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-border/50 bg-card">
                <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <CheckCircle className="size-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold">Message Sent!</h3>
                <p className="text-sm text-muted-foreground mt-2">We&apos;ll get back to you within 24 hours.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-6 h-10 px-6 rounded-lg border border-border text-xs font-semibold uppercase tracking-widest hover:bg-muted transition-all"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-xl border border-border/50 bg-card">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Name *</label>
                    <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full h-11 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full h-11 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Subject *</label>
                  <input required value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                    className="w-full h-11 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    className="w-full px-3 py-2 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-12 rounded-lg bg-foreground text-background text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="size-4 animate-spin" /> Sending...</> : <><Send className="size-4" /> Send Message</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}