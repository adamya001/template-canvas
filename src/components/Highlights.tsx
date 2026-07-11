import React, { useState, useEffect, useRef } from "react";
import { Zap, ShieldCheck, HeartHandshake, Eye, Sparkles, MonitorSmartphone, TrendingUp } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import AnimatedBackground from "./AnimatedBackground";

interface HighlightsProps {
  isDark: boolean;
}

function useCountUp(target: number, duration: number = 2000, isVisible: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);
  return count;
}

export default function Highlights({ isDark }: HighlightsProps) {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const uptimeCount = useCountUp(999, 1800, statsVisible);
  const templateCount = useCountUp(500, 2000, statsVisible);
  const supportCount = useCountUp(24, 1200, statsVisible);

  const highlights = [
    {
      icon: Zap,
      title: "Extremely Fast & Responsive",
      desc: "Optimized template rendering and direct DOM modifications ensure zero latency while customizing element positions, dimensions, alignments, and backgrounds.",
      gradient: "linear-gradient(135deg, #fef3c7, #fde68a)",
      iconColor: "#d97706",
      glowColor: "rgba(217,119,6,0.15)",
      delay: 0,
    },
    {
      icon: Sparkles,
      title: "AI Copywriting Companion",
      desc: "Uses the power of Gemini AI to understand your design context and instantly generates beautiful text fields tailored to Wedding, Document, Form, or Email templates.",
      gradient: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
      iconColor: "#6366f1",
      glowColor: "rgba(99,102,241,0.15)",
      delay: 80,
    },
    {
      icon: MonitorSmartphone,
      title: "Canvas Scaling System",
      desc: "An advanced responsive viewport container that automatically fits any resolution. Customize text elements, layout borders, and alignment on-the-fly with precision.",
      gradient: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
      iconColor: "#2563eb",
      glowColor: "rgba(37,99,235,0.15)",
      delay: 160,
    },
    {
      icon: ShieldCheck,
      title: "Role-Based Customizations",
      desc: "Separate workflows for Guest Users and platform Administrators. Admins can manage default presets, edit canvas layers, and publish global designs.",
      gradient: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
      iconColor: "#059669",
      glowColor: "rgba(5,150,105,0.15)",
      delay: 240,
    },
    {
      icon: Eye,
      title: "Immediate Visual Downloads",
      desc: "Export your finished template instantly into high-quality digital layouts, or copy the compiled HTML/Text source payload for surveys and SaaS emails.",
      gradient: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
      iconColor: "#db2777",
      glowColor: "rgba(219,39,119,0.15)",
      delay: 320,
    },
    {
      icon: HeartHandshake,
      title: "100% Free & Open Source",
      desc: "Fully modular full-stack layout structure. Clean types, file-based persistence database, and robust APIs ready to export or deploy to any environment.",
      gradient: "linear-gradient(135deg, #ccfbf1, #99f6e4)",
      iconColor: "#0d9488",
      glowColor: "rgba(13,148,136,0.15)",
      delay: 400,
    },
  ];

  return (
    <section
      id="highlights"
      className="relative py-28 overflow-hidden"
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-color)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <AnimatedBackground showParticles={false} showOrbs variant="section" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <ScrollReveal animation="fadeUp">
          <div className="text-center mb-20">
            <span
              className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full mb-4"
              style={{
                background: "var(--accent-light)",
                color: "var(--accent)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              Platform Capabilities
            </span>
            <h2
              className="font-display text-3xl sm:text-5xl font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Why Choose{" "}
              <span className="shimmer-text">TemplateGen?</span>
            </h2>
            <p className="font-sans text-sm max-w-xl mx-auto mt-4" style={{ color: "var(--text-secondary)" }}>
              We blend robust Canva-style layouts, smooth micro-interactions, and artificial intelligence into a blazingly fast template builder.
            </p>
          </div>
        </ScrollReveal>

        {/* Highlights Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={index} animation="fadeUp" delay={item.delay}>
                <div
                  className="relative rounded-3xl p-7 transition-all hover:-translate-y-1 hover:scale-[1.01] group overflow-hidden card-3d"
                  style={{
                    background: isDark ? "var(--bg-card)" : "#fff",
                    border: "1px solid var(--border-card)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${item.glowColor}, var(--shadow-md)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                  }}
                >
                  {/* Decorative corner gradient */}
                  <div
                    className="absolute top-0 right-0 w-28 h-28 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at top right, ${item.glowColor}, transparent 70%)`,
                      borderRadius: "0 20px 0 100%",
                    }}
                  />

                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      background: isDark
                        ? `${item.iconColor}22`
                        : item.gradient,
                      boxShadow: `0 4px 14px ${item.glowColor}`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: item.iconColor }} />
                  </div>

                  <h3
                    className="font-display font-bold text-base leading-snug mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Stats Banner */}
        <div ref={statsRef} className="mt-20">
          <ScrollReveal animation="fadeUp">
            <div
              className="rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, #1e1b4b 0%, #1e1035 100%)"
                  : "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                border: "1px solid rgba(99,102,241,0.3)",
                boxShadow: "0 20px 60px rgba(99,102,241,0.20)",
              }}
            >
              {/* Background sparkle */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                  className="absolute w-64 h-64 -top-20 -right-20 rounded-full opacity-20"
                  style={{ background: "radial-gradient(circle, rgba(129,140,248,0.5), transparent 70%)" }}
                />
                <div
                  className="absolute w-48 h-48 -bottom-10 -left-10 rounded-full opacity-15"
                  style={{ background: "radial-gradient(circle, rgba(244,114,182,0.5), transparent 70%)" }}
                />
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-10 sm:gap-16 text-left relative z-10">
                <div
                  className="text-center"
                  style={{ animation: statsVisible ? "countUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards" : "none" }}
                >
                  <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-display">
                    {statsVisible ? `${(uptimeCount / 10).toFixed(1)}%` : "0%"}
                  </div>
                  <div className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-bold mt-1">
                    Uptime Guarantee
                  </div>
                </div>
                <div
                  className="text-center"
                  style={{ animation: statsVisible ? "countUp 0.6s 0.15s cubic-bezier(0.22,1,0.36,1) forwards" : "none" }}
                >
                  <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-display">
                    {statsVisible ? `${templateCount}+` : "0+"}
                  </div>
                  <div className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-bold mt-1">
                    Pro Templates
                  </div>
                </div>
                <div
                  className="text-center"
                  style={{ animation: statsVisible ? "countUp 0.6s 0.30s cubic-bezier(0.22,1,0.36,1) forwards" : "none" }}
                >
                  <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-display">
                    {statsVisible ? `${supportCount}/7` : "0/7"}
                  </div>
                  <div className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-bold mt-1">
                    Expert Support
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="text-left md:text-right md:max-w-xs relative z-10">
                <div className="flex items-center gap-2 mb-3 md:justify-end">
                  {[...Array(5)].map((_, i) => (
                    <TrendingUp key={i} className="w-4 h-4 text-amber-400 animate-twinkle" style={{ animationDelay: `${i * 0.3}s` }} />
                  ))}
                </div>
                <p className="text-sm text-indigo-200 italic font-serif">
                  "TemplateGen redefined our workflow with its rapid-fast architecture and instant canvas generator."
                </p>
                <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider mt-2">
                  — Pro User Review
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
