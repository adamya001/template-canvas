import React, { useState } from "react";
import { Filter, Trash2, Layout, Plus, Heart, FileText, CheckSquare, Mail, Layers, Lock } from "lucide-react";
import { Template, TemplateCategory, User } from "../types";
import ScrollReveal from "./ScrollReveal";

interface TemplateCategoriesProps {
  templates: Template[];
  user: User | null;
  onSelectTemplate: (template: Template) => void;
  onDeleteTemplate: (templateId: string) => void;
  onCreateBlankTemplate: (category: TemplateCategory) => void;
  isDark: boolean;
}

export default function TemplateCategories({
  templates,
  user,
  onSelectTemplate,
  onDeleteTemplate,
  onCreateBlankTemplate,
  isDark,
}: TemplateCategoriesProps) {
  const [activeTab, setActiveTab] = useState<TemplateCategory | "all">("all");

  const categories = [
    { id: "all", label: "All Templates", icon: Layers },
    { id: "wedding", label: "Weddings", icon: Heart },
    { id: "document", label: "Documents", icon: FileText },
    { id: "form", label: "Forms", icon: CheckSquare },
    { id: "email", label: "Emails", icon: Mail },
  ] as const;

  const filteredTemplates = activeTab === "all"
    ? templates
    : templates.filter(t => t.category === activeTab);

  const getCategoryStyle = (cat: TemplateCategory) => {
    switch (cat) {
      case "wedding":   return { bg: "rgba(219,39,119,0.12)", color: "#db2777", border: "rgba(249,168,212,0.4)" };
      case "document":  return { bg: "rgba(37,99,235,0.12)",  color: "#2563eb", border: "rgba(147,197,253,0.4)" };
      case "form":      return { bg: "rgba(217,119,6,0.12)",  color: "#d97706", border: "rgba(252,211,77,0.4)" };
      case "email":     return { bg: "rgba(5,150,105,0.12)",  color: "#059669", border: "rgba(110,231,183,0.4)" };
    }
  };

  return (
    <section
      id="templates"
      className="py-24 relative overflow-hidden"
      style={{
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, var(--accent) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <ScrollReveal animation="fadeUp">
          <div className="text-center mb-14">
            <span
              className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full mb-4"
              style={{
                background: "var(--accent-light)",
                color: "var(--accent)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              Template Library
            </span>
            <h2
              className="font-display text-3xl sm:text-5xl font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Explore Visual Canvas{" "}
              <span className="shimmer-text">Templates</span>
            </h2>
            <p className="font-sans text-sm max-w-xl mx-auto mt-4" style={{ color: "var(--text-secondary)" }}>
              Click any template card below to open it in our responsive editor. Customize layout positions, text elements, and generate AI copy.
            </p>
          </div>
        </ScrollReveal>

        {/* Tab Filters */}
        <ScrollReveal animation="scaleIn" delay={100}>
          <div
            id="templates-filter-tabs"
            className="flex flex-wrap items-center justify-center gap-2 mb-14 pb-6"
            style={{ borderBottom: "1px solid var(--border-color)" }}
          >
            {categories.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-filter-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all hover:scale-[1.03] active:scale-95"
                  style={{
                    background: isActive ? "var(--accent)" : "var(--bg-card)",
                    color: isActive ? "#fff" : "var(--text-secondary)",
                    border: `1px solid ${isActive ? "var(--accent)" : "var(--border-color)"}`,
                    boxShadow: isActive ? "0 2px 14px rgba(99,102,241,0.35)" : "var(--shadow-sm)",
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Quick Action: Start from Scratch */}
        <ScrollReveal animation="fadeUp" delay={120}>
          <div
            className="rounded-3xl p-6 mb-14 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {/* Spinning ring decoration */}
            <div
              className="absolute right-6 top-6 w-16 h-16 animate-spin-slow pointer-events-none"
              style={{
                border: "1.5px dashed rgba(99,102,241,0.2)",
                borderRadius: "50%",
              }}
            />

            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 animate-float"
                style={{ background: "var(--accent-light)" }}
              >
                <Layout className="w-6 h-6" style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base" style={{ color: "var(--text-primary)" }}>
                  Create custom design from scratch
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  Start with a clean blank slate container matching your category proportions.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {(["wedding", "document", "form", "email"] as TemplateCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCreateBlankTemplate(cat)}
                  className="flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all active:scale-95 flex items-center justify-center gap-1.5 hover:scale-105"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                    (e.currentTarget as HTMLElement).style.background = "var(--accent-light)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)";
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)";
                  }}
                >
                  {user ? (
                    <Plus className="w-3.5 h-3.5" />
                  ) : (
                    <Lock className="w-3 h-3" style={{ color: "var(--accent)" }} />
                  )}
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Templates Grid */}
        <div id="templates-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, idx) => {
            const catStyle = getCategoryStyle(template.category);
            return (
              <ScrollReveal key={template.id} animation="fadeUp" delay={idx * 60}>
                <div
                  id={`template-card-${template.id}`}
                  className="rounded-3xl overflow-hidden transition-all group flex flex-col justify-between card-3d hover:-translate-y-1"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-card)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${catStyle?.bg || "rgba(99,102,241,0.15)"}, var(--shadow-md)`;
                    (e.currentTarget as HTMLElement).style.borderColor = catStyle?.border || "var(--border-card)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-card)";
                  }}
                >
                  {/* Visual Canvas Representation Thumbnail */}
                  <div
                    onClick={() => onSelectTemplate(template)}
                    className="h-64 cursor-pointer relative flex items-center justify-center p-6 overflow-hidden"
                    style={{
                      backgroundColor: template.backgroundColor,
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    {/* Tier badge */}
                    <div
                      className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                      style={{
                        background: template.tier === "paid" ? "rgba(255,248,230,0.95)" : "var(--bg-glass)",
                        border: `1px solid ${template.tier === "paid" ? "#fbbf24" : "var(--border-color)"}`,
                        color: template.tier === "paid" ? "#d97706" : "var(--text-muted)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {template.tier === "paid" ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>⭐ Premium</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Free</span>
                        </>
                      )}
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/8 transition-colors z-10 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 px-5 py-2.5 bg-indigo-600 text-white rounded-full font-bold text-xs transition-all tracking-wider uppercase shadow-xl scale-90 group-hover:scale-100 z-20 flex items-center gap-1.5">
                        {!user && <Lock className="w-3.5 h-3.5 text-indigo-200" />}
                        <span>{user ? "Open Editor" : "Sign In to Use"}</span>
                      </span>
                    </div>

                    {/* Mini template preview */}
                    <div className="w-full h-full relative scale-45 opacity-80 group-hover:scale-50 group-hover:opacity-100 transition-all origin-center pointer-events-none">
                      <div
                        className="absolute inset-0 border border-slate-200/30 shadow-sm rounded-lg flex flex-col justify-around p-4"
                        style={{ backgroundColor: template.backgroundColor }}
                      >
                        {template.elements.slice(0, 4).map((el) => (
                          <div
                            key={el.id}
                            className="text-center font-bold overflow-hidden whitespace-nowrap text-ellipsis"
                            style={{
                              fontSize: `${(el.fontSize || 12) * 1.5}px`,
                              color: el.color || "#333333",
                              backgroundColor: el.backgroundColor || "transparent",
                              borderRadius: el.borderRadius === "full" ? "9999px" : "4px",
                              padding: el.backgroundColor ? "4px 8px" : "0px",
                            }}
                          >
                            {el.text?.substring(0, 30)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Template Metadata */}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest"
                        style={{
                          background: catStyle?.bg || "var(--accent-light)",
                          color: catStyle?.color || "var(--accent)",
                          border: `1px solid ${catStyle?.border || "var(--border-color)"}`,
                        }}
                      >
                        {template.category}
                      </span>
                      {template.isAdminPreset && (
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                          Official
                        </span>
                      )}
                    </div>

                    <h3
                      className="font-display font-bold text-base transition-colors group-hover:text-indigo-500"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {template.title}
                    </h3>

                    <p className="text-xs mt-1.5 leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                      {template.description}
                    </p>

                    <div
                      className="flex items-center justify-between gap-3 mt-5 pt-4"
                      style={{ borderTop: "1px solid var(--border-color)" }}
                    >
                      <button
                        onClick={() => onSelectTemplate(template)}
                        className="text-xs font-bold transition-colors flex items-center gap-1 hover:gap-2"
                        style={{ color: "var(--accent)" }}
                      >
                        {!user && <Lock className="w-3 h-3 shrink-0" />}
                        <span>{user ? "Use Template →" : "Sign in to Use →"}</span>
                      </button>

                      {user?.role === "admin" && (
                        <button
                          id={`delete-preset-${template.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete preset "${template.title}"?`)) {
                              onDeleteTemplate(template.id);
                            }
                          }}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: "var(--text-muted)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#f43f5e"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                          title="Delete Preset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}

          {filteredTemplates.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <Layers className="w-12 h-12 mx-auto mb-4 animate-float" style={{ color: "var(--text-muted)" }} />
              <p className="font-medium" style={{ color: "var(--text-muted)" }}>
                No templates found in this category. Be the first to create one!
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
