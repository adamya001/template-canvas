import React, { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { SignIn, SignUp } from "@clerk/clerk-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: any, token: string) => void;
  isDark?: boolean;
}

export default function LoginModal({ isOpen, onClose, isDark }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Lock scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen && !mounted) return null;
  if (!isOpen) return null;

  const clerkAppearance = {
    variables: {
      colorPrimary: "#6366f1",
      colorBackground: isDark ? "#161b2e" : "#ffffff",
      colorText: isDark ? "#f1f5f9" : "#0f172a",
      colorTextSecondary: isDark ? "#94a3b8" : "#475569",
      colorInputBackground: isDark ? "#1e2842" : "#f8fafc",
      colorInputText: isDark ? "#f1f5f9" : "#0f172a",
      colorNeutral: isDark ? "#94a3b8" : "#64748b",
      borderRadius: "14px",
    },
    elements: {
      rootBox: "w-full",
      card: `shadow-2xl w-full ${isDark ? "bg-[#161b2e] border border-indigo-900/40" : "bg-white border border-slate-100"}`,
      headerTitle: `font-display font-bold ${isDark ? "text-white" : "text-slate-900"}`,
      headerSubtitle: isDark ? "text-slate-400" : "text-slate-500",
      socialButtonsBlockButton: `${isDark ? "bg-[#1e2842] border-indigo-900/40 text-white hover:bg-[#252f50]" : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"} transition-colors`,
      formFieldInput: `${isDark ? "bg-[#1e2842] border-indigo-900/40 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900"} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20`,
      formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md",
      footer: { display: "none" },
      footerAction: { display: "none" },
      footerActionLink: { display: "none" },
    },
  };

  return (
    <div
      id="login-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{
        background: isDark
          ? "rgba(11,13,23,0.85)"
          : "rgba(15,23,42,0.60)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Decorative background orbs inside modal backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-64 h-64 -top-20 -left-20 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.5), transparent 70%)" }}
        />
        <div
          className="absolute w-48 h-48 -bottom-10 -right-10 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, rgba(244,114,182,0.5), transparent 70%)" }}
        />
      </div>

      <div
        id="login-card-container"
        className="relative w-full max-w-md animate-scale-in"
      >
        {/* Header branding above Clerk card */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3" style={{
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.30)",
            color: "#a5b4fc",
          }}>
            <Sparkles className="w-3.5 h-3.5" />
            TemplateGen Canvas Studio
          </div>
        </div>

        {/* Close Button */}
        <button
          id="close-login-btn"
          onClick={onClose}
          className="absolute -top-2 right-0 text-slate-400 hover:text-white transition-colors p-2 rounded-xl z-50"
          style={{
            background: "rgba(30,40,80,0.6)",
            border: "1px solid rgba(99,102,241,0.25)",
            backdropFilter: "blur(8px)",
          }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Clerk Auth Component */}
        <div className="w-full flex justify-center">
          {isSignUp ? (
            <SignUp
              routing="virtual"
              appearance={clerkAppearance}
            />
          ) : (
            <SignIn
              routing="virtual"
              appearance={clerkAppearance}
            />
          )}
        </div>

        {/* Toggle link below card */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm font-bold underline underline-offset-4 transition-colors"
            style={{ color: "rgba(167,139,250,0.9)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(167,139,250,0.9)"; }}
          >
            {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up Free"}
          </button>
        </div>
      </div>
    </div>
  );
}
