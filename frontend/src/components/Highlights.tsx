import React from "react";
import { Zap, ShieldCheck, HeartHandshake, Eye, Sparkles, MonitorSmartphone } from "lucide-react";

export default function Highlights() {
  const highlights = [
    {
      icon: Zap,
      title: "Extremely Fast & Responsive",
      desc: "Optimized template rendering and direct DOM modifications ensure zero latency while customizing element positions, dimensions, alignments, and backgrounds.",
      color: "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
      icon: Sparkles,
      title: "AI Copywriting Companion",
      desc: "Uses the power of Gemini-3.5-Flash to understand your design context (Wedding, Document, Form, Email) and instantly generates beautiful text fields based on your prompt.",
      color: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
    {
      icon: MonitorSmartphone,
      title: "Canvas Scaling System",
      desc: "An advanced responsive viewport container that automatically fits any resolution. Customize text elements, layout borders, and alignment on-the-fly.",
      color: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      icon: ShieldCheck,
      title: "Role-Based Customizations",
      desc: "Separate workflows for Guest Users and platform Administrators. Admins can manage default presets, edit canvas layers, and publish global designs.",
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      icon: Eye,
      title: "Immediate Visual Downloads",
      desc: "Export your finished template instantly into high-quality digital layouts, or copy the compiled HTML/Text source payload for surveys and SaaS emails.",
      color: "bg-pink-50 text-pink-700 border-pink-100",
    },
    {
      icon: HeartHandshake,
      title: "100% Free & Open Source",
      desc: "Fully modular full-stack layout structure. Clean types, file-based persistence database, and robust APIs ready to export or deploy.",
      color: "bg-teal-50 text-teal-700 border-teal-100",
    },
  ];

  return (
    <section id="highlights" className="py-24 bg-gray-50/50 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest rounded-full mb-3">
            Platform Capabilities
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Why Choose TemplateGen?
          </h2>
          <p className="font-sans text-sm text-gray-500 max-w-xl mx-auto mt-2">
            Discover how we blend robust Canva-style layouts, smooth micro-interactions, and artificial intelligence into a fast template builder.
          </p>
        </div>

        {/* Highlights Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-7 border border-gray-200/60 shadow-sm hover:shadow-md transition-all group"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border mb-5 ${item.color}`}>
                  <Icon className="w-5 h-5 group-hover:scale-105 transition-transform" />
                </div>
                <h3 className="font-display font-bold text-slate-950 text-base leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-2.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Objective banner statement: Editorial Aesthetic layout pattern */}
        <div className="mt-16 bg-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row justify-between items-center gap-8 border border-slate-800 shadow-sm">
          <div className="flex flex-wrap gap-8 sm:gap-12 text-left">
            <div>
              <div className="text-3xl font-bold tracking-tight text-white">99.9%</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight text-white">500+</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Pro Templates</div>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight text-white">24/7</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Expert Support</div>
            </div>
          </div>
          <div className="text-left md:text-right md:max-w-xs">
            <p className="text-sm text-slate-300 italic font-serif">
              "TemplateGen redefined our workflow with its rapid-fast architecture and instant canvas generator."
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
