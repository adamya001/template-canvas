import React from "react";
import { Sparkles, HelpCircle, ShieldCheck, ArrowUpRight, Heart, Github } from "lucide-react";

interface FooterProps {
  isDark: boolean;
}

export default function Footer({ isDark }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="footer-section"
      className="relative overflow-hidden py-16"
      style={{
        background: isDark
          ? "linear-gradient(to bottom, #0b0d17, #0e1020)"
          : "linear-gradient(to bottom, #0f172a, #1e1b4b)",
        borderTop: "1px solid rgba(99,102,241,0.2)",
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 left-1/4 w-96 h-96 rounded-full opacity-10 animate-orb"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.5), transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-8 animate-orb"
          style={{
            background: "radial-gradient(circle, rgba(244,114,182,0.4), transparent 70%)",
            animationDelay: "-4s",
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0v60M0 60h60' stroke='%236366f1' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Animated top border gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.6) 30%, rgba(167,139,250,0.8) 50%, rgba(99,102,241,0.6) 70%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

          {/* Logo Brand Statement */}
          <div className="col-span-1 md:col-span-2">
            {/* Animated logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="relative w-10 h-10">
                <div
                  className="absolute inset-0 animate-spin-slow"
                  style={{
                    border: "2px solid transparent",
                    borderTopColor: "rgba(129,140,248,0.6)",
                    borderRightColor: "rgba(167,139,250,0.3)",
                    borderRadius: "50%",
                  }}
                />
                <div
                  className="w-8 h-8 m-1 rounded-lg flex items-center justify-center text-white font-black text-base"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    boxShadow: "0 0 20px rgba(99,102,241,0.4)",
                  }}
                >
                  T
                </div>
              </div>
              <span className="font-display font-black text-xl tracking-tighter uppercase text-white">
                TemplateGen
              </span>
            </div>

            <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(148,163,184,0.8)" }}>
              Providing simple, fast, and professional template customization systems. We utilize responsive canvas styling with server-side Gemini intelligence to redefine graphic and structural copywriting workflows.
            </p>

            {/* Made with love */}
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest" style={{ color: "rgba(100,116,139,0.9)" }}>
              <span>Made with</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
              <span>by TemplateGen Corp</span>
            </div>
          </div>

          {/* Quick Support Links */}
          <div>
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" style={{ color: "rgba(129,140,248,0.8)" }} />
              <span>Support</span>
            </h4>
            <ul className="space-y-3 text-xs" style={{ color: "rgba(148,163,184,0.75)" }}>
              {["Help Center", "Visual Tutorials", "Email Support", "Enterprise Licenses"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <span>{item}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Guidelines / Privacy */}
          <div>
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" style={{ color: "rgba(129,140,248,0.8)" }} />
              <span>Legal</span>
            </h4>
            <ul className="space-y-3 text-xs" style={{ color: "rgba(148,163,184,0.75)" }}>
              {["Terms of Service", "Privacy Policy", "Asset Licensing", "GDPR Compliance"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(100,116,139,0.8)",
          }}
        >
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p>© {currentYear} TemplateGen Corp. All Rights Reserved.</p>
            <p className="text-[10px]" style={{ color: "rgba(71,85,105,0.8)" }}>
              An independent educational template generator system.
            </p>
          </div>

          {/* Back to top */}
          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white transition-all hover:scale-105 active:scale-95 group"
            style={{
              background: "rgba(99,102,241,0.2)",
              border: "1px solid rgba(99,102,241,0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.20)";
            }}
          >
            <Sparkles className="w-3.5 h-3.5 group-hover:animate-spin-slow" style={{ color: "rgba(167,139,250,0.9)" }} />
            <span>Back to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
