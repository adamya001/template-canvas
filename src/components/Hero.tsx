import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Wand2, FileText, Mail, CheckSquare, Heart, Search, ChevronDown } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";

interface HeroProps {
  onCategorySelect: (category: "wedding" | "document" | "form" | "email") => void;
  onExploreTemplates: () => void;
  onSearchCategory: (category: "wedding" | "document" | "form" | "email") => void;
  isDark: boolean;
}

export default function Hero({ onCategorySelect, onExploreTemplates, onSearchCategory, isDark }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    const target = val.toLowerCase().trim();
    if (target === "wedding" || target === "document" || target === "form" || target === "email") {
      onSearchCategory(target);
      setSearchQuery("");
    }
  };

  // 3D tilt effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const categories = [
    { id: "wedding", label: "Wedding", desc: "Romantic & Elegant", icon: Heart,
      gradient: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
      iconColor: "#db2777", glowColor: "rgba(219,39,119,0.20)", border: "rgba(249,168,212,0.6)" },
    { id: "document", label: "Document", desc: "Corporate Proposals", icon: FileText,
      gradient: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
      iconColor: "#2563eb", glowColor: "rgba(37,99,235,0.20)", border: "rgba(147,197,253,0.6)" },
    { id: "form", label: "Forms", desc: "Creative Checklists", icon: CheckSquare,
      gradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
      iconColor: "#d97706", glowColor: "rgba(217,119,6,0.20)", border: "rgba(252,211,77,0.6)" },
    { id: "email", label: "Emails", desc: "SaaS Newsletters", icon: Mail,
      gradient: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
      iconColor: "#059669", glowColor: "rgba(5,150,105,0.20)", border: "rgba(110,231,183,0.6)" },
  ] as const;

  return (
    <section
      id="hero-section"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden py-20 sm:py-28"
      style={{ background: "var(--hero-bg)" }}
    >
      {/* Animated background */}
      <AnimatedBackground showParticles showOrbs showRings />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

        {/* Top badge */}
        <div className="animate-fade-in mb-6">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full"
            style={{
              background: "var(--accent-light)",
              color: "var(--accent)",
              border: "1px solid rgba(99,102,241,0.25)",
              boxShadow: "0 0 20px rgba(99,102,241,0.12)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Fast & Intuitive Canvas Studio
            <Sparkles className="w-3.5 h-3.5 animate-pulse delay-300" />
          </span>
        </div>

        {/* Main heading with shimmer */}
        <h1
          id="hero-tagline"
          className="animate-fade-in delay-100 font-display font-black tracking-tight max-w-5xl mx-auto leading-[1.05] mb-6"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            color: "var(--text-primary)",
          }}
        >
          Design your{" "}
          <span className="shimmer-text italic font-serif inline-block">
            vision
          </span>
          <br />
          <span style={{ color: "var(--text-primary)" }}>in just a few clicks.</span>
        </h1>

        {/* Subheading */}
        <p
          className="animate-fade-in delay-200 font-sans text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          The ultimate template generator and interactive design system. Powered by Gemini AI for beautiful
          wedding cards, professional documents, interactive forms, and stunning marketing emails.
        </p>

        {/* Search Bar */}
        <div className="animate-fade-in delay-300 max-w-lg mx-auto mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none" style={{ color: "var(--text-muted)" }}>
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="category-search-bar"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Type a category to open: 'wedding', 'document', 'form', 'email'..."
              className="w-full pl-12 pr-5 py-4 text-xs sm:text-sm rounded-full shadow-md transition-all focus:outline-none font-medium"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-light), 0 4px 20px rgba(0,0,0,0.06)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
              }}
            />
            {searchQuery && (
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold font-mono px-2 py-0.5 rounded-full animate-pulse"
                style={{ background: "var(--accent-light)", color: "var(--accent)" }}
              >
                Type full name to open
              </span>
            )}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="animate-fade-in delay-400 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            id="hero-explore-btn"
            onClick={onExploreTemplates}
            className="w-full sm:w-auto px-8 py-4 text-white rounded-full font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2.5 group hover:scale-105"
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)",
              boxShadow: "0 4px 20px rgba(99,102,241,0.40), 0 1px 4px rgba(0,0,0,0.10)",
            }}
          >
            <Wand2 className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
            <span>Explore Templates</span>
          </button>
          <button
            onClick={() => onCategorySelect("wedding")}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2.5 hover:scale-105"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Try a Template</span>
          </button>
        </div>

        {/* Quick category cards */}
        <div className="mt-4">
          <div className="flex items-center justify-between max-w-5xl mx-auto mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Featured Categories
            </h2>
            <button
              onClick={onExploreTemplates}
              className="text-xs font-bold flex items-center gap-1 transition-all hover:gap-2"
              style={{ color: "var(--accent)" }}
            >
              <span>View All Templates →</span>
            </button>
          </div>

          <div id="quick-categories-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  id={`cat-quick-${cat.id}`}
                  onClick={() => onCategorySelect(cat.id)}
                  className="animate-fade-in group relative h-40 rounded-3xl p-5 overflow-hidden text-left cursor-pointer transition-all hover:scale-[1.04] hover:-translate-y-1 active:scale-95 card-3d"
                  style={{
                    background: isDark
                      ? `linear-gradient(135deg, rgba(30,40,70,0.8), rgba(20,25,50,0.9))`
                      : cat.gradient,
                    border: `1px solid ${cat.border}`,
                    boxShadow: `0 4px 20px ${cat.glowColor}`,
                    animationDelay: `${0.5 + idx * 0.1}s`,
                  }}
                >
                  {/* Decorative circle */}
                  <div
                    className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-40 transition-transform group-hover:scale-125 group-hover:opacity-60"
                    style={{ background: cat.glowColor }}
                  />

                  {/* Spinning mini ring */}
                  <div
                    className="absolute top-2 right-2 w-8 h-8 animate-spin-slow"
                    style={{
                      border: `1.5px dashed ${cat.iconColor}33`,
                      borderRadius: "50%",
                    }}
                  />

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6"
                        style={{
                          background: isDark ? `${cat.iconColor}22` : `${cat.iconColor}18`,
                          boxShadow: `0 2px 10px ${cat.glowColor}`,
                        }}
                      >
                        <Icon
                          className="w-5 h-5 transition-transform"
                          style={{ color: isDark ? cat.iconColor : cat.iconColor }}
                        />
                      </div>
                      <span
                        className="font-bold text-sm sm:text-base"
                        style={{ color: isDark ? "var(--text-primary)" : cat.iconColor }}
                      >
                        {cat.label}
                      </span>
                    </div>
                    <div>
                      <p
                        className="text-[10px] font-mono opacity-70 uppercase tracking-wider"
                        style={{ color: isDark ? "var(--text-muted)" : cat.iconColor }}
                      >
                        {cat.desc}
                      </p>
                      <div
                        className="text-[10px] font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                        style={{ color: cat.iconColor }}
                      >
                        Open editor →
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 animate-bounce-slow" style={{ color: "var(--text-muted)" }}>
          <span className="text-[10px] font-mono uppercase tracking-widest">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
}
