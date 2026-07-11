import React from "react";
import { Sparkles, HelpCircle, FileLock2, ShieldCheck, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="footer-section" className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Logo Brand Statement */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 text-white mb-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-lg">
                T
              </div>
              <span className="font-display font-black text-lg tracking-tighter uppercase">
                TemplateGen
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
              Providing simple, fast, and professional template customization systems. We utilize responsive canvas styling with server-side Gemini intelligence to redefine graphic and structural copywriting workflows.
            </p>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">
              MERN Project Template System
            </div>
          </div>

          {/* Quick Support Links */}
          <div>
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>Customer Support</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#support" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Help Center</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="#tutorial" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Visual Tutorials</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="mailto:support@templategen.com" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Inquire via Email</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Enterprise Licenses</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Guidelines / Privacy */}
          <div>
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Security & Policies</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#licensing" className="hover:text-white transition-colors">Asset Licensing Guidelines</a>
              </li>
              <li>
                <a href="#gdpr" className="hover:text-white transition-colors">GDPR & Cookie Compliance</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright, Trademarks and Back To Top */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p>
              © {currentYear} TemplateGen Corp. All Rights Reserved.
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5 max-w-2xl leading-normal">
              Disclaimer: TemplateGen is an independent educational template generator system.
            </p>
          </div>
          
          <button
            onClick={handleScrollToTop}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-semibold"
          >
            Back to Top
          </button>
        </div>

      </div>
    </footer>
  );
}
