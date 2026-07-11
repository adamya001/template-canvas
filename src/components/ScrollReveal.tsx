import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  key?: React.Key;
  children: React.ReactNode;
  animation?: "fadeUp" | "fadeLeft" | "fadeRight" | "scaleIn";
  delay?: number;
  threshold?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  animation = "fadeUp",
  delay = 0,
  threshold = 0.12,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const animMap: Record<string, string> = {
    fadeUp: "animate-fade-in",
    fadeLeft: "animate-fade-in-left",
    fadeRight: "animate-fade-in-right",
    scaleIn: "animate-scale-in",
  };

  const style: React.CSSProperties = {
    animationDelay: `${delay}ms`,
    animationFillMode: "both",
  };

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? animMap[animation] : "opacity-0"}`}
      style={visible ? style : { opacity: 0 }}
    >
      {children}
    </div>
  );
}
