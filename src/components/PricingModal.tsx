import React, { useState, useEffect } from "react";
import { X, Check, Sparkles, CreditCard, ShieldCheck, Award, Heart, FileText, Zap, Star } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { User } from "../types";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  token: string | null;
  onUpgradeSuccess: (updatedUser: User) => void;
  isDark?: boolean;
}

// Dynamically load Razorpay script if not already present
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof (window as any).Razorpay !== "undefined") {
      resolve(true);
      return;
    }
    const existing = document.getElementById("razorpay-checkout-js");
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

export default function PricingModal({
  isOpen,
  onClose,
  user,
  token,
  onUpgradeSuccess,
  isDark,
}: PricingModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Pre-load Razorpay script when modal opens
      loadRazorpayScript();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!user) {
      setErrorMsg("Please sign in to upgrade to Pro.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    // Fetch fresh Clerk token, fallback to prop token for mock auth
    const activeToken = (await getToken()) || token;
    if (!activeToken) {
      setErrorMsg("Authentication token invalid or missing. Please try signing in again.");
      setLoading(false);
      return;
    }

    // Ensure Razorpay script is loaded
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || typeof (window as any).Razorpay === "undefined") {
      setErrorMsg("Payment gateway failed to load. Please check your internet connection and try again.");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create Order in our backend
      const res = await fetch("/api/payments/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Could not create Razorpay order.");
      }

      const orderData = await res.json();

      // Step 2: Configure Razorpay Checkout Options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "TemplateGen Canvas Pro",
        description: "Lifetime Premium Templates Access",
        image: "", // Optional logo URL
        order_id: orderData.orderId,
        handler: async (response: any) => {
          setLoading(true);
          try {
            // Get fresh token for verification, fallback to activeToken
            const verificationToken = (await getToken()) || token || activeToken;

            // Step 3: Verify payment signature on our server
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${verificationToken}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment signature verification failed.");
            }

            if (verifyData.success && verifyData.user) {
              onUpgradeSuccess(verifyData.user);
              onClose();
            }
          } catch (err: any) {
            setErrorMsg(err.message || "Something went wrong during payment verification.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: "",
        },
        notes: {
          userId: user.id,
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => setLoading(false),
          animation: true,
        },
      };

      // Open Razorpay Overlay
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setErrorMsg(`Payment failed: ${response.error?.description || "Unknown error"}`);
        setLoading(false);
      });
      rzp.open();
      setLoading(false);
    } catch (err: any) {
      console.error("Order creation failed:", err);
      setErrorMsg(err.message || "Failed to contact payment gateway.");
      setLoading(false);
    }
  };

  const benefits = [
    "Full unrestricted access to all Wedding templates",
    "Full unrestricted access to all Document templates",
    "Create customized blank canvas layouts without limits",
    "Higher density high-resolution export qualities",
    "No expiration date — lifetime premium status",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{
        background: isDark ? "rgba(11,13,23,0.88)" : "rgba(15,23,42,0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        id="pricing-card-container"
        className="w-full max-w-2xl overflow-hidden relative rounded-3xl animate-scale-in flex flex-col md:flex-row max-h-[95vh]"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-card)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.30), 0 10px 30px rgba(99,102,241,0.15)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl z-20 transition-all hover:scale-110"
          style={{
            color: "var(--text-muted)",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left hero side */}
        <div
          className="md:w-5/12 p-8 flex flex-col justify-between relative overflow-hidden text-white"
          style={{
            background: "linear-gradient(145deg, #312e81 0%, #4c1d95 50%, #1e1b4b 100%)",
          }}
        >
          {/* Spinning decorative rings */}
          <div className="absolute -right-8 -top-8 w-32 h-32 animate-spin-slow" style={{ border: "1.5px dashed rgba(167,139,250,0.2)", borderRadius: "50%" }} />
          <div className="absolute -left-4 -bottom-4 w-24 h-24 animate-spin-slow-reverse" style={{ border: "1px solid rgba(129,140,248,0.15)", borderRadius: "50%" }} />

          {/* Glowing orb */}
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 animate-orb"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.8), transparent 70%)" }}
          />

          <div className="relative z-10">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 w-max mb-4"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              Go Premium
            </span>
            <h3 className="font-display text-2xl font-black leading-tight mb-2">
              Unlock Your Ultimate Creative Toolkit
            </h3>
            <p className="text-xs text-white/75 leading-relaxed">
              Design like a professional with high-end templates curated specifically for weddings and formal documents.
            </p>
          </div>

          <div className="relative z-10 mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                <Heart className="w-4 h-4 text-pink-300 fill-pink-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold">Weddings Collection</h4>
                <p className="text-[10px] text-white/60">Beautiful romantic invites</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                <FileText className="w-4 h-4 text-blue-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold">Professional Docs</h4>
                <p className="text-[10px] text-white/60">Reports, proposals, templates</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                <Zap className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold">Unlimited Exports</h4>
                <p className="text-[10px] text-white/60">High-resolution downloads</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[10px] text-white/50 flex items-center gap-1.5 mt-6 border-t border-white/10 pt-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure 256-bit encrypted payments via Razorpay</span>
          </div>
        </div>

        {/* Right pricing side */}
        <div
          className="md:w-7/12 p-8 flex flex-col justify-between overflow-y-auto"
          style={{ background: "var(--bg-card)" }}
        >
          <div>
            <h2 className="font-display text-xl font-black" style={{ color: "var(--text-primary)" }}>
              Visual Canvas Pro Lifetime
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              One simple one-time payment. Never pay monthly fees or renewal rates.
            </p>

            {/* Price box */}
            <div
              className="my-6 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute w-32 h-32 -top-8 -right-8 rounded-full opacity-20"
                  style={{ background: "radial-gradient(circle, rgba(99,102,241,0.5), transparent 70%)" }}
                />
              </div>
              <div className="relative z-10">
                <span className="text-xs font-mono font-bold line-through" style={{ color: "var(--text-muted)" }}>₹1,999</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-display font-black" style={{ color: "var(--text-primary)" }}>₹499</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>One-Time</span>
                </div>
              </div>
              <span
                className="relative z-10 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider"
                style={{ background: "var(--accent-light)", color: "var(--accent)" }}
              >
                Save 75%
              </span>
            </div>

            {/* Benefits list */}
            <div className="space-y-3">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "var(--accent-light)" }}
                  >
                    <Check className="w-3 h-3 stroke-[3]" style={{ color: "var(--accent)" }} />
                  </div>
                  <span className="text-xs leading-tight" style={{ color: "var(--text-secondary)" }}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 border-t pt-6" style={{ borderColor: "var(--border-color)" }}>
            {errorMsg && (
              <div
                className="mb-4 p-3 rounded-xl text-xs font-medium text-center"
                style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", color: "#f43f5e" }}
              >
                {errorMsg}
              </div>
            )}

            <button
              id="payment-trigger-btn"
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-3.5 text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2.5 active:scale-98 hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none"
              style={{
                background: loading
                  ? "var(--bg-secondary)"
                  : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.40)",
                color: loading ? "var(--text-muted)" : "#fff",
              }}
            >
              {loading ? (
                <>
                  <div
                    className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin-slow"
                    style={{ borderColor: "currentColor", borderTopColor: "transparent" }}
                  />
                  <span>Initializing Secure Gateway...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4.5 h-4.5" />
                  <span>Pay ₹499 via Razorpay</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-center mt-3 flex items-center justify-center gap-1" style={{ color: "var(--text-muted)" }}>
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Lifetime access credited instantly to your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
