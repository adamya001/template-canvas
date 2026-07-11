import React, { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TemplateCategories from "./components/TemplateCategories";
import Highlights from "./components/Highlights";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import CanvasEditor from "./components/CanvasEditor";
import AdminPanel from "./components/AdminPanel";
import PricingModal from "./components/PricingModal";
import { User, Template, Design, TemplateCategory, CanvasElement } from "./types";
import { FolderHeart, Layers, Trash2, Edit, Sparkles, Star } from "lucide-react";
import ScrollReveal from "./components/ScrollReveal";

export default function App() {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { getToken, signOut } = useAuth();

  // Dark mode state — load from localStorage
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  // Apply theme to root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {}
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);

  // Navigation & UI Section Highlight state
  const [currentSection, setCurrentSection] = useState("home");

  // Auth states
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Pricing & Pro states
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<Template | null>(null);
  const [pendingCategory, setPendingCategory] = useState<TemplateCategory | null>(null);

  // Template / Designs DB list states
  const [templates, setTemplates] = useState<Template[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);

  // Editing state variables
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // NOTE: Guest timer popup REMOVED intentionally.
  // Login modal only opens when user explicitly clicks Sign In.

  // Load initial configuration (templates list)
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Sync Clerk authenticated state with our local user / token state
  useEffect(() => {
    const syncClerkUser = async () => {
      if (isLoaded) {
        if (isSignedIn && clerkUser) {
          const email = clerkUser.primaryEmailAddress?.emailAddress || "";
          const id = clerkUser.id;
          const name = clerkUser.fullName || clerkUser.firstName || email.split("@")[0] || "User";
          const username = clerkUser.username || email.split("@")[0] || "user";

          // Define admin check
          const role = (email === "warlockadam234@gmail.com" || username.toLowerCase().startsWith("admin")) ? "admin" : "user";

          const mappedUser: User = { id, username, name, role, isPro: role === "admin" };
          setUser(mappedUser);

          const clerkToken = await getToken();
          if (clerkToken) {
            setToken(clerkToken);

            try {
              const res = await fetch("/api/user/profile", {
                headers: { Authorization: `Bearer ${clerkToken}` }
              });
              if (res.ok) {
                const dbUser = await res.json();
                setUser({
                  ...dbUser,
                  role: mappedUser.role === "admin" ? "admin" : dbUser.role,
                  isPro: mappedUser.role === "admin" ? true : dbUser.isPro,
                });
              }
            } catch (err) {
              console.error("Failed to sync backend user profile:", err);
            }

            fetchDesigns(clerkToken);
          }
        } else {
          setUser(null);
          setToken(null);
          setDesigns([]);
        }
      }
    };
    syncClerkUser();
  }, [isLoaded, isSignedIn, clerkUser]);

  // Close login modal automatically when user successfully signs in
  useEffect(() => {
    if (isSignedIn) {
      setIsLoginOpen(false);
    }
  }, [isSignedIn]);

  // Sync scroll positions to highlight active menu item
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "templates", "highlights", "my-designs"];
      const scrollPos = window.scrollY + 220;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      if (!res.ok) throw new Error("Templates call failed");
      const data = await res.json();
      setTemplates(data);
    } catch (e) {
      console.error("Error fetching templates:", e);
    }
  };

  const fetchDesigns = async (userToken?: string) => {
    try {
      const activeToken = userToken || (await getToken());
      if (!activeToken) return;
      const res = await fetch("/api/designs", {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (!res.ok) throw new Error("Designs call failed");
      const data = await res.json();
      setDesigns(data);
    } catch (e) {
      console.error("Error fetching designs:", e);
    }
  };

  const handleLoginSuccess = (loggedInUser: User, sessionToken: string) => {
    setUser(loggedInUser);
    setToken(sessionToken);
    fetchDesigns(sessionToken);
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setToken(null);
    setDesigns([]);
    setCurrentSection("home");
  };

  const handleNavigate = (sectionId: string) => {
    setCurrentSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Launch the editor with an existing template
  const handleSelectTemplate = (template: Template) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    // Pro check for wedding and document
    if ((template.category === "wedding" || template.category === "document") && !user.isPro && user.role !== "admin") {
      setPendingTemplate(template);
      setIsPricingOpen(true);
      return;
    }

    setCurrentTemplate(template);
    setEditingDesignId(null);
  };

  // Admin delete of preset
  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const res = await fetch(`/api/templates/${templateId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete preset template");
      setTemplates(templates.filter(t => t.id !== templateId));
    } catch (e) {
      console.error("Error deleting template preset:", e);
    }
  };

  // Launch visual editor on a blank canvas scratch board
  const handleCreateBlankTemplate = (category: TemplateCategory) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    // Pro check for wedding and document
    if ((category === "wedding" || category === "document") && !user.isPro && user.role !== "admin") {
      setPendingCategory(category);
      setIsPricingOpen(true);
      return;
    }

    const blankTemplate: Template = {
      id: `blank-${Date.now()}`,
      title: `Untitled ${category.toUpperCase()} Design`,
      category,
      description: "A blank starter page ready for your layout customization.",
      backgroundColor: "#FFFFFF",
      width: 600,
      height: 800,
      elements: [
        {
          id: "blank-text-heading",
          type: "text",
          text: "Double-click to start typing",
          fontSize: 24,
          fontFamily: "display",
          fontWeight: "bold",
          color: "#1E293B",
          x: 10,
          y: 40,
          width: 80,
          align: "center"
        }
      ]
    };
    setCurrentTemplate(blankTemplate);
    setEditingDesignId(null);
  };

  // Handle successful Pro upgrade
  const handleUpgradeSuccess = (updatedUser: User) => {
    setUser(updatedUser);
    alert("Congratulations! You are now a PRO member! Unlimited access has been unlocked.");

    if (pendingTemplate) {
      setCurrentTemplate(pendingTemplate);
      setEditingDesignId(null);
    } else if (pendingCategory) {
      const blankTemplate: Template = {
        id: `blank-${Date.now()}`,
        title: `Untitled ${pendingCategory.toUpperCase()} Design`,
        category: pendingCategory,
        description: "A blank starter page ready for your layout customization.",
        backgroundColor: "#FFFFFF",
        width: 600,
        height: 800,
        elements: [
          {
            id: "blank-text-heading",
            type: "text",
            text: "Double-click to start typing",
            fontSize: 24,
            fontFamily: "display",
            fontWeight: "bold",
            color: "#1E293B",
            x: 10,
            y: 40,
            width: 80,
            align: "center"
          }
        ]
      };
      setCurrentTemplate(blankTemplate);
      setEditingDesignId(null);
    }

    setPendingTemplate(null);
    setPendingCategory(null);
  };

  // Launch editor with an existing user design
  const handleEditDesign = (design: Design) => {
    const tempTemplate: Template = {
      id: design.templateId,
      title: design.title,
      category: design.category,
      description: "User customized canvas elements.",
      backgroundColor: design.backgroundColor,
      width: 600,
      height: 800,
      elements: design.elements
    };
    setCurrentTemplate(tempTemplate);
    setEditingDesignId(design.id);
  };

  const handleDeleteDesign = async (designId: string) => {
    const activeToken = await getToken();
    if (!activeToken) return;
    try {
      const res = await fetch(`/api/designs/${designId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${activeToken}`
        }
      });
      if (res.ok) {
        setDesigns(designs.filter(d => d.id !== designId));
      }
    } catch (e) {
      console.error("Error deleting design:", e);
    }
  };

  // Perform saving details of modified layouts
  const handleSaveDesign = async (title: string, backgroundColor: string, elements: CanvasElement[]) => {
    const activeToken = await getToken();
    if (!user || !activeToken) return;
    setIsSaving(true);
    try {
      const isExisting = designs.some(d => d.id === editingDesignId);
      const url = isExisting ? `/api/designs/${editingDesignId}` : "/api/designs";
      const method = isExisting ? "PUT" : "POST";
      const body = isExisting
        ? { title, backgroundColor, elements }
        : { templateId: currentTemplate?.id, title, category: currentTemplate?.category, backgroundColor, elements };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`
        },
        body: JSON.stringify(body)
      });

      const saved = await res.json();
      if (!res.ok) throw new Error(saved.error);

      if (isExisting) {
        setDesigns(designs.map(d => d.id === editingDesignId ? saved : d));
      } else {
        setDesigns([...designs, saved]);
      }

      setCurrentTemplate(null);
      setEditingDesignId(null);

      // Auto-focus Portfolio tab
      setTimeout(() => handleNavigate("my-designs"), 100);
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans antialiased"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* Header element */}
      <Header
        currentSection={currentSection}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setIsLoginOpen(true)}
        savedDesignsCount={designs.length}
        onPricingClick={() => setIsPricingOpen(true)}
        isDark={isDark}
        onToggleDark={toggleDark}
      />

      {/* Conditional Rendering between guest/user homepage and Admin Portal */}
      {currentSection !== "admin-panel" ? (
        <>
          {/* Hero section */}
          <div id="home">
            <Hero
              onCategorySelect={(cat) => handleCreateBlankTemplate(cat)}
              onExploreTemplates={() => handleNavigate("templates")}
              onSearchCategory={(category) => {
                const matched = templates.find(t => t.category === category);
                if (matched) {
                  handleSelectTemplate(matched);
                } else {
                  alert(`No templates found for category: ${category}`);
                }
              }}
              isDark={isDark}
            />
          </div>

          {/* Main categories template selector grids */}
          <div id="templates">
            <TemplateCategories
              templates={templates}
              user={user}
              onSelectTemplate={handleSelectTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              onCreateBlankTemplate={handleCreateBlankTemplate}
              isDark={isDark}
            />
          </div>

          {/* Platform Features highlights */}
          <div id="highlights">
            <Highlights isDark={isDark} />
          </div>

          {/* User Portfolio saved designs */}
          {user && (
            <section
              id="my-designs"
              className="py-20 border-t"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollReveal animation="fadeUp">
                  <div className="text-center mb-12">
                    <span
                      className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 w-max mx-auto mb-3"
                      style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                    >
                      <FolderHeart className="w-3.5 h-3.5" />
                      <span>My Visual Library</span>
                    </span>
                    <h2
                      className="font-display text-3xl sm:text-4xl font-bold tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Your Custom Designs Portfolio
                    </h2>
                    <p className="font-sans text-sm mt-2 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
                      Reopen, edit, download, or grab compiled HTML codes of your designs anytime.
                    </p>
                  </div>
                </ScrollReveal>

                {designs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {designs.map((design, idx) => (
                      <ScrollReveal key={design.id} animation="fadeUp" delay={idx * 80}>
                        <div
                          id={`portfolio-card-${design.id}`}
                          className="rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between card-3d"
                          style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-card)",
                          }}
                        >
                          {/* Visual box rendering background color representing the template */}
                          <div
                            onClick={() => handleEditDesign(design)}
                            className="h-48 cursor-pointer relative flex items-center justify-center overflow-hidden"
                            style={{
                              backgroundColor: design.backgroundColor,
                              borderBottom: "1px solid var(--border-color)",
                            }}
                          >
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/12 transition-colors z-10 flex items-center justify-center">
                              <span className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-indigo-600 text-white rounded-full font-bold text-xs shadow-md transition-opacity">
                                Edit Canvas Design
                              </span>
                            </div>
                            <div className="text-center text-xs font-mono scale-90 pointer-events-none p-4" style={{ color: "var(--text-muted)" }}>
                              <div className="font-bold mb-1 uppercase text-[10px] tracking-wider" style={{ color: "var(--text-secondary)" }}>
                                {design.category}
                              </div>
                              <div className="line-clamp-2 font-semibold mb-2 text-sm leading-tight" style={{ color: "var(--text-primary)" }}>
                                {design.title}
                              </div>
                              <div className="text-[10px] uppercase">
                                Created: {new Date(design.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="p-5 flex items-center justify-between gap-3">
                            <div>
                              <h4 className="font-display font-bold text-sm truncate max-w-[160px]" style={{ color: "var(--text-primary)" }}>
                                {design.title}
                              </h4>
                              <span className="text-[10px] font-mono block mt-0.5 uppercase" style={{ color: "var(--text-muted)" }}>
                                {design.category} Proportions
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditDesign(design)}
                                title="Edit Design Layout"
                                className="p-1.5 rounded-xl transition-all hover:scale-110"
                                style={{
                                  background: "var(--bg-secondary)",
                                  border: "1px solid var(--border-color)",
                                  color: "var(--text-secondary)",
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete design "${design.title}"?`)) {
                                    handleDeleteDesign(design.id);
                                  }
                                }}
                                title="Delete Design Layout"
                                className="p-1.5 rounded-xl transition-all hover:scale-110 hover:text-rose-500"
                                style={{
                                  background: "var(--bg-secondary)",
                                  border: "1px solid var(--border-color)",
                                  color: "var(--text-secondary)",
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                ) : (
                  <ScrollReveal animation="scaleIn">
                    <div
                      className="rounded-3xl border p-12 text-center max-w-xl mx-auto shadow-sm"
                      style={{ background: "var(--bg-card)", borderColor: "var(--border-card)" }}
                    >
                      <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--accent-light)" }}>
                        <Layers className="w-8 h-8" style={{ color: "var(--accent)" }} />
                      </div>
                      <h3 className="font-display font-bold text-base" style={{ color: "var(--text-primary)" }}>Your Canvas is Empty</h3>
                      <p className="text-xs mt-2 max-w-sm mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        Start by choosing an official preset wedding, document, or form layout, customize the details, and hit Save.
                      </p>
                      <button
                        onClick={() => handleNavigate("templates")}
                        className="px-5 py-2.5 text-white rounded-xl text-xs font-semibold mt-5 transition-all active:scale-95 shadow-md hover:opacity-90"
                        style={{ background: "var(--accent)" }}
                      >
                        Create Your First Design
                      </button>
                    </div>
                  </ScrollReveal>
                )}
              </div>
            </section>
          )}
        </>
      ) : (
        /* Render administrator-only control board */
        user?.role === "admin" && (
          <AdminPanel
            user={user}
            templates={templates}
            onDeleteTemplate={handleDeleteTemplate}
            onSelectTemplate={handleSelectTemplate}
            onCreateBlankTemplate={handleCreateBlankTemplate}
          />
        )
      )}

      {/* Footer Element */}
      <Footer isDark={isDark} />

      {/* Dynamic Login / Sign Up Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        isDark={isDark}
      />

      {/* Pricing / Pro Payment Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => {
          setIsPricingOpen(false);
          setPendingTemplate(null);
          setPendingCategory(null);
        }}
        user={user}
        token={token}
        onUpgradeSuccess={handleUpgradeSuccess}
        isDark={isDark}
      />

      {/* Visual Canvas Editor Overlay */}
      {currentTemplate && (
        <CanvasEditor
          template={currentTemplate}
          user={user}
          onSave={handleSaveDesign}
          onClose={() => {
            setCurrentTemplate(null);
            setEditingDesignId(null);
          }}
          isSaving={isSaving}
          onLoginPrompt={() => setIsLoginOpen(true)}
        />
      )}
    </div>
  );
}
