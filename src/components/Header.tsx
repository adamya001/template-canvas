import React, { useState, useEffect } from "react";
import { Sparkles, User as UserIcon, LogOut, LayoutGrid, Award, FolderHeart, Shield, CreditCard, Sun, Moon, Menu, X } from "lucide-react";
import { User } from "../types";

interface HeaderProps {
  currentSection: string;
  onNavigate: (sectionId: string) => void;
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  savedDesignsCount: number;
  onPricingClick: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export default function Header({
  currentSection,
  onNavigate,
  user,
  onLogout,
  onLoginClick,
  savedDesignsCount,
  onPricingClick,
  isDark,
  onToggleDark,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home", icon: Sparkles },
    { id: "templates", label: "Templates", icon: LayoutGrid },
    { id: "highlights", label: "Features", icon: Award },
    { id: "pricing", label: "Pricing", icon: CreditCard },
  ];

  if (user) {
    navItems.push({ id: "my-designs", label: `Designs (${savedDesignsCount})`, icon: FolderHeart });
    if (user.role === "admin") {
      navItems.push({ id: "admin-panel", label: "Admin", icon: Shield });
    }
  }

  const handleNavClick = (itemId: string) => {
    if (itemId === "pricing") {
      onPricingClick();
    } else {
      onNavigate(itemId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-40 transition-all duration-300"
      style={{
        background: scrolled ? "var(--header-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: scrolled ? `1px solid var(--border-color)` : "1px solid transparent",
        boxShadow: scrolled ? "var(--shadow-sm)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand Name */}
          <div
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            {/* Animated spinning ring around logo */}
            <div className="relative w-10 h-10">
              <div
                className="absolute inset-0 animate-spin-slow"
                style={{
                  border: "2px solid transparent",
                  borderTopColor: "rgba(99,102,241,0.55)",
                  borderRightColor: "rgba(167,139,250,0.30)",
                  borderRadius: "50%",
                }}
              />
              <div
                className="w-8 h-8 m-1 rounded-lg flex items-center justify-center text-white font-black text-base shadow-md group-hover:scale-105 transition-transform"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  boxShadow: "0 0 15px rgba(99,102,241,0.4)",
                }}
              >
                T
              </div>
            </div>
            <div className="flex flex-col">
              <span
                id="header-logo"
                className="font-display text-lg font-black tracking-tighter uppercase leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                TemplateGen
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest font-semibold" style={{ color: "var(--text-muted)" }}>
                Canvas Studio
              </span>
            </div>
          </div>

          {/* Desktop Navigation Bar */}
          <nav
            id="navbar-links"
            className="hidden md:flex items-center gap-1 p-1 rounded-full"
            style={{
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(241,245,249,0.80)",
              border: "1px solid var(--border-color)",
            }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                  style={{
                    background: isActive ? "var(--accent)" : "transparent",
                    color: isActive ? "#ffffff" : "var(--text-secondary)",
                    boxShadow: isActive ? "0 2px 10px rgba(99,102,241,0.35)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                  }}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Go PRO badge */}
            {user && !user.isPro && user.role !== "admin" && (
              <button
                onClick={onPricingClick}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 font-bold text-[11px] rounded-full transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
                  color: "#fff",
                  boxShadow: "0 2px 12px rgba(245,158,11,0.40)",
                  animation: "glowPulse 3s ease-in-out infinite",
                }}
              >
                <Sparkles className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
                <span>Go PRO</span>
              </button>
            )}

            {/* Dark/Light mode toggle */}
            <button
              id="theme-toggle"
              onClick={onToggleDark}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{
                background: isDark ? "rgba(129,140,248,0.15)" : "rgba(241,245,249,0.9)",
                border: "1px solid var(--border-color)",
                color: isDark ? "#818cf8" : "#6366f1",
              }}
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Auth controls */}
            {user ? (
              <div id="user-status-indicator" className="flex items-center gap-2.5">
                <div className="hidden sm:flex flex-col text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                      {user.name}
                    </span>
                    {(user.isPro || user.role === "admin") && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider" style={{ background: "#f59e0b", color: "#fff" }}>
                        PRO
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-mono uppercase font-bold tracking-wider" style={{ color: "var(--text-muted)" }}>
                    {user.role}
                  </span>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center relative"
                  style={{
                    background: isDark ? "rgba(99,102,241,0.2)" : "#f1f5f9",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <UserIcon className="w-4 h-4" />
                  {(user.role === "admin" || user.isPro) && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <button
                  id="logout-btn"
                  onClick={onLogout}
                  title="Logout Session"
                  className="p-1.5 rounded-lg transition-all hover:scale-110"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#f43f5e"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="login-btn-header"
                onClick={onLoginClick}
                className="flex items-center gap-2 px-5 py-2 text-white font-semibold text-xs rounded-full transition-all shadow-md active:scale-95 hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)",
                  boxShadow: "0 2px 12px rgba(99,102,241,0.35)",
                }}
              >
                Sign In
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 rounded-lg transition-all"
              style={{ color: "var(--text-secondary)" }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            className="md:hidden pb-4 animate-fade-in"
            style={{ borderTop: "1px solid var(--border-color)" }}
          >
            <div className="flex flex-col gap-1 pt-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left"
                    style={{
                      background: isActive ? "var(--accent-light)" : "transparent",
                      color: isActive ? "var(--accent)" : "var(--text-secondary)",
                    }}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
