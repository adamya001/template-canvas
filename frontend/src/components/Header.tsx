import React from "react";
import { Sparkles, User as UserIcon, LogOut, LayoutGrid, Award, FolderHeart, Shield } from "lucide-react";
import { User } from "../types";

interface HeaderProps {
  currentSection: string;
  onNavigate: (sectionId: string) => void;
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  savedDesignsCount: number;
}

export default function Header({ 
  currentSection, 
  onNavigate, 
  user, 
  onLogout, 
  onLoginClick,
  savedDesignsCount 
}: HeaderProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Sparkles },
    { id: "templates", label: "Templates", icon: LayoutGrid },
    { id: "highlights", label: "Highlights", icon: Award },
  ];

  if (user) {
    navItems.push({ id: "my-designs", label: `My Designs (${savedDesignsCount})`, icon: FolderHeart });
    if (user.role === "admin") {
      navItems.push({ id: "admin-panel", label: "Admin Portal", icon: Shield });
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Name */}
          <div 
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              T
            </div>
            <div className="flex flex-col">
              <span id="header-logo" className="font-display text-lg font-black text-slate-900 tracking-tighter uppercase leading-tight">
                TemplateGen
              </span>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
                Canvas Studio
              </span>
            </div>
          </div>

          {/* Navigation Bar Section */}
          <nav id="navbar-links" className="hidden md:flex items-center gap-1.5 bg-gray-50/80 p-1 rounded-full border border-gray-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900 hover:bg-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Auth Controls */}
          <div className="flex items-center gap-3">
            {user ? (
              <div id="user-status-indicator" className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                    {user.role}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 relative group">
                  <UserIcon className="w-4 h-4" />
                  {user.role === "admin" && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <button
                  id="logout-btn"
                  onClick={onLogout}
                  title="Logout Session"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <button
                id="login-btn-header"
                onClick={onLoginClick}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-full transition-all shadow-sm active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl text-[11px] font-semibold transition-all ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
