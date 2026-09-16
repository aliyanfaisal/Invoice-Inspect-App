"use client";

import { motion } from "framer-motion";
import { Sparkles, Code2, ShieldCheck, Zap, Calculator, FileText, CheckCircle2, PieChart } from "lucide-react";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-grid-pattern">
      {/* Glowing Orbs */}
      <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-primary/40 rounded-full blur-[100px] mix-blend-screen dark:mix-blend-lighten animate-pulse" />
      <div className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] bg-accent/40 rounded-full blur-[100px] mix-blend-screen dark:mix-blend-lighten animate-pulse" style={{ animationDelay: "2s" }} />
    </div>
  );
}

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 hidden lg:block">
      <motion.div
        animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] left-[10%] p-4 bg-card rounded-2xl shadow-xl border border-border/50 glass-card"
      >
        <Sparkles className="w-8 h-8 text-primary" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[25%] right-[12%] p-5 bg-card rounded-2xl shadow-xl border border-border/50 glass-card"
      >
        <ShieldCheck className="w-10 h-10 text-accent" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[25%] left-[15%] p-3 bg-card rounded-2xl shadow-xl border border-border/50 glass-card"
      >
        <Calculator className="w-7 h-7 text-primary" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 25, 0], rotate: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-[20%] right-[15%] p-4 bg-card rounded-2xl shadow-xl border border-border/50 glass-card"
      >
        <Zap className="w-8 h-8 text-accent" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute top-[40%] left-[5%] p-3 bg-card rounded-2xl shadow-xl border border-border/50 glass-card"
      >
        <FileText className="w-6 h-6 text-accent" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        className="absolute top-[50%] right-[5%] p-3 bg-card rounded-2xl shadow-xl border border-border/50 glass-card"
      >
        <CheckCircle2 className="w-6 h-6 text-primary" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -30, 0], rotate: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-[10%] right-[30%] p-2 bg-card rounded-xl shadow-xl border border-border/50 glass-card"
      >
        <Code2 className="w-5 h-5 text-primary" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 3.5 }}
        className="absolute bottom-[10%] left-[30%] p-2 bg-card rounded-xl shadow-xl border border-border/50 glass-card"
      >
        <PieChart className="w-5 h-5 text-accent" />
      </motion.div>
    </div>
  );
}
