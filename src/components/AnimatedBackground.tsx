import React from "react";

interface AnimatedBackgroundProps {
  variant?: "hero" | "section" | "dark";
  showParticles?: boolean;
  showOrbs?: boolean;
  showRings?: boolean;
  className?: string;
}

/* Particle positions & animation configs */
const PARTICLES = [
  { size: 4, top: "15%", left: "8%",  delay: 0,    duration: 7 },
  { size: 3, top: "25%", left: "88%", delay: 1.2,  duration: 8 },
  { size: 5, top: "65%", left: "5%",  delay: 0.5,  duration: 6 },
  { size: 3, top: "80%", left: "92%", delay: 2,    duration: 9 },
  { size: 4, top: "45%", left: "75%", delay: 0.8,  duration: 7.5 },
  { size: 3, top: "10%", left: "55%", delay: 1.5,  duration: 8.5 },
  { size: 2, top: "90%", left: "40%", delay: 0.3,  duration: 6.5 },
  { size: 5, top: "35%", left: "20%", delay: 1.8,  duration: 7.8 },
  { size: 3, top: "55%", left: "50%", delay: 2.5,  duration: 9.2 },
  { size: 4, top: "72%", left: "65%", delay: 0.7,  duration: 6.8 },
];

/* Decorative star/sparkle positions */
const SPARKLES = [
  { size: 6, top: "18%", left: "30%", delay: 0 },
  { size: 5, top: "42%", left: "82%", delay: 0.8 },
  { size: 7, top: "70%", left: "15%", delay: 1.6 },
  { size: 5, top: "85%", left: "70%", delay: 2.4 },
  { size: 6, top: "30%", left: "60%", delay: 0.4 },
];

export default function AnimatedBackground({
  variant = "hero",
  showParticles = true,
  showOrbs = true,
  showRings = false,
  className = "",
}: AnimatedBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Gradient mesh */}
      <div className="absolute inset-0 gradient-mesh" />

      {/* Animated gradient orbs */}
      {showOrbs && (
        <>
          {/* Orb 1 — top right */}
          <div
            className="absolute animate-orb"
            style={{
              width: 520,
              height: 520,
              top: "-140px",
              right: "-120px",
              background: "var(--orb-1)",
              filter: "blur(60px)",
              borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            }}
          />
          {/* Orb 2 — bottom left */}
          <div
            className="absolute animate-orb"
            style={{
              width: 400,
              height: 400,
              bottom: "-80px",
              left: "-80px",
              background: "var(--orb-2)",
              filter: "blur(60px)",
              borderRadius: "40% 60% 70% 30% / 50% 60% 30% 60%",
              animationDelay: "-4s",
            }}
          />
          {/* Orb 3 — center right */}
          <div
            className="absolute animate-orb"
            style={{
              width: 300,
              height: 300,
              top: "40%",
              right: "15%",
              background: "var(--orb-3)",
              filter: "blur(50px)",
              borderRadius: "50% 60% 30% 40% / 40% 50% 60% 50%",
              animationDelay: "-2s",
            }}
          />
        </>
      )}

      {/* Spinning decorative rings */}
      {showRings && (
        <>
          <div
            className="animate-spin-slow absolute"
            style={{
              width: 320,
              height: 320,
              top: "10%",
              left: "5%",
              border: "1.5px dashed rgba(99,102,241,0.18)",
              borderRadius: "50%",
            }}
          />
          <div
            className="animate-spin-slow-reverse absolute"
            style={{
              width: 180,
              height: 180,
              top: "15%",
              left: "12%",
              border: "1.5px solid transparent",
              borderTopColor: "rgba(99,102,241,0.30)",
              borderRightColor: "rgba(167,139,250,0.20)",
              borderRadius: "50%",
            }}
          />
          <div
            className="animate-spin-slow absolute"
            style={{
              width: 240,
              height: 240,
              bottom: "8%",
              right: "8%",
              border: "1.5px dashed rgba(244,114,182,0.18)",
              borderRadius: "50%",
            }}
          />
          <div
            className="animate-spin-slow-reverse absolute"
            style={{
              width: 140,
              height: 140,
              bottom: "15%",
              right: "15%",
              borderWidth: "1.5px",
              borderStyle: "solid",
              borderColor: "transparent",
              borderTopColor: "rgba(244,114,182,0.30)",
              borderRightColor: "rgba(96,165,250,0.25)",
              borderRadius: "50%",
            }}
          />
        </>
      )}

      {/* Floating particles */}
      {showParticles && (
        <>
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="particle-dot"
              style={{
                width: p.size,
                height: p.size,
                top: p.top,
                left: p.left,
                animationName: "particleDrift",
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                animationIterationCount: "infinite",
                animationTimingFunction: "ease-in-out",
              }}
            />
          ))}

          {/* Sparkle stars */}
          {SPARKLES.map((s, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute animate-twinkle"
              style={{
                width: s.size,
                height: s.size,
                top: s.top,
                left: s.left,
                animationDelay: `${s.delay}s`,
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="text-indigo-400/40 w-full h-full">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.5L12 17l-6.2 4.4 2.4-7.5L2 9.4h7.6z" />
              </svg>
            </div>
          ))}
        </>
      )}

      {/* Subtle grid pattern */}
      {variant === "section" && (
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M60 0v60M0 60h60' stroke='%236366f1' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      )}
    </div>
  );
}
