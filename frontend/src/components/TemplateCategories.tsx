import React, { useState } from "react";
import { Filter, Trash2, Layout, Plus, Heart, FileText, CheckSquare, Mail, Layers, Lock } from "lucide-react";
import { Template, TemplateCategory, User } from "../types";

interface TemplateCategoriesProps {
  templates: Template[];
  user: User | null;
  onSelectTemplate: (template: Template) => void;
  onDeleteTemplate: (templateId: string) => void;
  onCreateBlankTemplate: (category: TemplateCategory) => void;
}

export default function TemplateCategories({
  templates,
  user,
  onSelectTemplate,
  onDeleteTemplate,
  onCreateBlankTemplate
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

  const getCategoryColor = (cat: TemplateCategory) => {
    switch (cat) {
      case "wedding": return "bg-pink-50 text-pink-700 border-pink-100";
      case "document": return "bg-blue-50 text-blue-700 border-blue-100";
      case "form": return "bg-amber-50 text-amber-700 border-amber-100";
      case "email": return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }
  };

  return (
    <section id="templates" className="py-20 bg-[#fdfdfd] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Explore Visual Canvas Templates
          </h2>
          <p className="font-sans text-sm text-gray-500 max-w-xl mx-auto mt-2">
            Click any template card below to open it in our responsive editor. Customize layout positions, text elements, and generate AI copy.
          </p>
        </div>

        {/* Tab Filters */}
        <div id="templates-filter-tabs" className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-gray-100 pb-6">
          {categories.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-filter-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm scale-102"
                    : "text-gray-600 hover:text-slate-900 bg-gray-50 hover:bg-gray-100/80"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Action: Start from Scratch (User/Admin) */}
        <div className="bg-gray-50/70 rounded-3xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Layout className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-800 text-base">
                Create custom design from scratch
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Start with a clean blank slate container matching your category proportions.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {(["wedding", "document", "form", "email"] as TemplateCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => onCreateBlankTemplate(cat)}
                className="flex-1 md:flex-none px-4 py-2 bg-white hover:bg-indigo-50/30 border border-gray-200 text-slate-700 hover:text-indigo-600 rounded-lg text-xs font-bold capitalize transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                {user ? (
                  <Plus className="w-3.5 h-3.5" />
                ) : (
                  <Lock className="w-3 h-3 text-indigo-500" />
                )}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div id="templates-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => {
            return (
              <div
                key={template.id}
                id={`template-card-${template.id}`}
                className="bg-white border border-gray-200/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-200 transition-all group flex flex-col justify-between"
              >
                {/* Visual Canvas Representation Thumbnail */}
                <div 
                  onClick={() => onSelectTemplate(template)}
                  className="h-64 cursor-pointer relative flex items-center justify-center p-6 border-b border-gray-100 overflow-hidden"
                  style={{ backgroundColor: template.backgroundColor }}
                >
                  {/* Bookmark / Tier Indicator */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border"
                    style={{
                      backgroundColor: template.tier === "paid" ? "#FFFDF5" : "#F8FAFC",
                      borderColor: template.tier === "paid" ? "#FBBF24" : "#E2E8F0",
                      color: template.tier === "paid" ? "#D97706" : "#475569"
                    }}
                  >
                    {template.tier === "paid" ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <span>⭐ Premium</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span>Free</span>
                      </>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors z-10 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 px-5 py-2.5 bg-indigo-600 text-white rounded-full font-bold text-xs transition-all tracking-wider uppercase shadow-md scale-95 group-hover:scale-100 z-20 flex items-center gap-1.5">
                      {!user && <Lock className="w-3.5 h-3.5 text-indigo-200" />}
                      <span>{user ? "Open Editor" : "Sign In to Use"}</span>
                    </span>
                  </div>

                  {/* Micro Visual representation of elements inside card */}
                  <div className="w-full h-full relative scale-45 opacity-80 group-hover:scale-48 group-hover:opacity-100 transition-transform origin-center pointer-events-none">
                    <div className="absolute inset-0 border border-slate-200/30 shadow-sm rounded-lg flex flex-col justify-around p-4" style={{ backgroundColor: template.backgroundColor }}>
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
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border font-sans ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                    {template.isAdminPreset && (
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                        Official
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-slate-950 text-base group-hover:text-indigo-600 transition-colors">
                    {template.title}
                  </h3>
                  
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => onSelectTemplate(template)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
                    >
                      {!user && <Lock className="w-3 h-3 text-indigo-500 shrink-0" />}
                      <span>{user ? "Use Template →" : "Sign in to Use →"}</span>
                    </button>

                    {/* Admin Delete Action */}
                    {user?.role === "admin" && (
                      <button
                        id={`delete-preset-${template.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete this preset "${template.title}" from the platform?`)) {
                            onDeleteTemplate(template.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Preset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredTemplates.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <p className="text-slate-400 font-medium">
                No templates found in this category. Be the first to create one!
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
