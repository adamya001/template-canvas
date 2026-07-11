import React, { useState } from "react";
import { X } from "lucide-react";
import { SignIn, SignUp } from "@clerk/clerk-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: any, token: string) => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isOpen) return null;

  return (
    <div 
      id="login-modal-overlay" 
      className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        // Close on clicking overlay background
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        id="login-card-container" 
        className="relative w-full max-w-md animate-scale-up"
      >
        {/* Close Button above card */}
        <button 
          id="close-login-btn"
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors p-2 rounded-xl bg-slate-900/40 backdrop-blur-md border border-white/10 z-50 hover:bg-slate-900/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Embed Clerk Sign-In / Sign-Up Components */}
        <div className="w-full flex justify-center">
          {isSignUp ? (
            <SignUp 
              routing="virtual"
              appearance={{
                variables: {
                  colorPrimary: "#4f46e5",
                },
                elements: {
                  rootBox: "w-full",
                  card: "shadow-2xl rounded-3xl border border-slate-100 w-full",
                  footer: { display: "none" },
                  footerAction: { display: "none" },
                }
              }}
            />
          ) : (
            <SignIn 
              routing="virtual"
              appearance={{
                variables: {
                  colorPrimary: "#4f46e5",
                },
                elements: {
                  rootBox: "w-full",
                  card: "shadow-2xl rounded-3xl border border-slate-100 w-full",
                  footer: { display: "none" },
                  footerAction: { display: "none" },
                }
              }}
            />
          )}
        </div>

        {/* Toggle link below card */}
        <div className="text-center mt-4">
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-white/95 hover:text-white font-bold text-sm underline underline-offset-4 drop-shadow"
          >
            {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up Free"}
          </button>
        </div>
      </div>
    </div>
  );
}

