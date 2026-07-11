import React, { useState } from "react";
import { Sparkles, Wand2, FileText, Mail, CheckSquare, Heart, Search } from "lucide-react";

interface HeroProps {
  onCategorySelect: (category: "wedding" | "document" | "form" | "email") => void;
  onExploreTemplates: () => void;
  onSearchCategory: (category: "wedding" | "document" | "form" | "email") => void;
}

export default function Hero({ onCategorySelect, onExploreTemplates, onSearchCategory }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    // Auto trigger opening first matching template when the category name is typed
    const target = val.toLowerCase().trim();
    if (target === "wedding" || target === "document" || target === "form" || target === "email") {
      onSearchCategory(target);
      setSearchQuery(""); // Clear search after opening
    }
  };

  const categories = [
    { id: "wedding", label: "Wedding", desc: "Traditional & Elegant", icon: Heart, bgClass: "bg-pink-100/70 hover:bg-pink-100", circleClass: "bg-pink-200/50", textClass: "text-pink-800" },
    { id: "document", label: "Document", desc: "Corporate Proposals", icon: FileText, bgClass: "bg-blue-100/70 hover:bg-blue-100", circleClass: "bg-blue-200/50", textClass: "text-blue-800" },
    { id: "form", label: "Forms", desc: "Creative Checklists", icon: CheckSquare, bgClass: "bg-amber-100/70 hover:bg-amber-100", circleClass: "bg-amber-200/50", textClass: "text-amber-800" },
    { id: "email", label: "Emails", desc: "SaaS Newsletters", icon: Mail, bgClass: "bg-emerald-100/70 hover:bg-emerald-100", circleClass: "bg-emerald-200/50", textClass: "text-emerald-800" },
  ] as const;

  return (
    <section id="hero-section" className="relative overflow-hidden bg-[#fdfdfd] py-16 sm:py-24 border-b border-gray-100">
      
      {/* Background visual graphics */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-pink-50/40 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Magic Tagline Header */}
        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
          Fast & Intuitive
        </span>

        <h1 id="hero-tagline" className="font-display text-4xl sm:text-6xl font-bold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
          Design your <span className="text-indigo-600 italic font-serif">vision</span> <br />in just a few clicks.
        </h1>

        <p className="font-sans text-sm sm:text-base text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
          The ultimate template generator and interactive design system. High-performance canvas tools built for beautiful wedding cards, professional documents, interactive survey forms, and marketing emails.
        </p>

        {/* Beautiful Category Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="category-search-bar"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Type a category to open (e.g. 'wedding', 'document', 'form', 'email')..."
              className="w-full pl-11 pr-5 py-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 font-medium text-xs sm:text-sm text-slate-800 placeholder-slate-400 rounded-full shadow-sm transition-all focus:outline-none"
            />
            {searchQuery && (
              <span className="absolute right-4 top-3.5 text-[9px] font-bold font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full animate-pulse">
                Type full category name to open
              </span>
            )}
          </div>
        </div>

        {/* Explore Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            id="hero-explore-btn"
            onClick={onExploreTemplates}
            className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-sm transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 group"
          >
            <Wand2 className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
            <span>Explore Templates</span>
          </button>
        </div>

        {/* Quick starter categories selection */}
        <div className="mt-8">
          <div className="flex items-center justify-between max-w-5xl mx-auto mb-6">
            <h2 className="text-xs font-bold uppercase tracking-tight text-gray-400">
              Featured Categories
            </h2>
            <button 
              onClick={onExploreTemplates} 
              className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
            >
              <span>View All Templates &rarr;</span>
            </button>
          </div>

          <div id="quick-categories-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  id={`cat-quick-${cat.id}`}
                  onClick={() => onCategorySelect(cat.id)}
                  className={`group relative h-36 rounded-2xl p-5 overflow-hidden text-left cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${cat.bgClass} border border-transparent hover:border-slate-200/40`}
                >
                  {/* Decorative background circle */}
                  <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-55 transition-transform group-hover:scale-110 ${cat.circleClass}`}></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${cat.textClass}`} />
                      <span className={`font-bold text-sm sm:text-base ${cat.textClass}`}>{cat.label}</span>
                    </div>
                    <div>
                      <p className={`text-[10px] font-mono opacity-80 uppercase tracking-wider ${cat.textClass}`}>
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
