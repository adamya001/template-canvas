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
import { User, Template, Design, TemplateCategory, CanvasElement } from "./types";
import { FolderHeart, Calendar, FileText, CheckSquare, Mail, Layers, Trash2, Edit, Plus, Sparkles } from "lucide-react";

export default function App() {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { getToken, signOut } = useAuth();

  // Navigation & UI Section Highlight state
  const [currentSection, setCurrentSection] = useState("home");
  
  // Auth states
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Template / Designs DB list states
  const [templates, setTemplates] = useState<Template[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);

  // Editing state variables
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Guest login countdown timer (5 minutes)
  const [timeLeft, setTimeLeft] = useState(300);
  useEffect(() => {
    if (user) {
      setTimeLeft(300);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsLoginOpen(true);
          return 300; // Reset countdown
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

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
          
          const mappedUser: User = { id, username, name, role };
          setUser(mappedUser);
          
          const clerkToken = await getToken();
          if (clerkToken) {
            setToken(clerkToken);
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

  const fetchDesigns = async (userToken: string) => {
    try {
      const res = await fetch("/api/designs", {
        headers: { Authorization: `Bearer ${userToken}` }
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

  // Launch editor with an existing user design
  const handleEditDesign = (design: Design) => {
    // Construct a temporary Template wrapper from user design structure
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
    if (!token) return;
    try {
      const res = await fetch(`/api/designs/${designId}`, {
        method: "DELETE"
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
    if (!user || !token) return;
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
          Authorization: `Bearer ${token}`
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      
      {/* Header element */}
      <Header
        currentSection={currentSection}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setIsLoginOpen(true)}
        savedDesignsCount={designs.length}
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
            />
          </div>

          {/* Platform Features highlights */}
          <div id="highlights">
            <Highlights />
          </div>

          {/* User Portfolio saved designs */}
          {user && (
            <section id="my-designs" className="py-20 bg-gray-50/70 border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-1.5 w-max mx-auto">
                    <FolderHeart className="w-3.5 h-3.5" />
                    <span>My Visual Library</span>
                  </span>
                  <h2 className="font-display text-3xl font-bold text-slate-900 mt-3">
                    Your Custom Designs Portfolio
                  </h2>
                  <p className="font-sans text-xs text-gray-500 mt-2 max-w-lg mx-auto">
                    Reopen, edit, download, or grab compiled HTML codes of your designs anytime.
                  </p>
                </div>

                {designs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {designs.map((design) => (
                      <div
                        key={design.id}
                        id={`portfolio-card-${design.id}`}
                        className="bg-white rounded-3xl overflow-hidden border border-gray-200/60 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
                      >
                        {/* Visual box rendering background color representing the template */}
                        <div 
                          onClick={() => handleEditDesign(design)}
                          className="h-48 cursor-pointer relative flex items-center justify-center border-b border-gray-100 overflow-hidden"
                          style={{ backgroundColor: design.backgroundColor }}
                        >
                          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors z-10 flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-indigo-600 text-white rounded-full font-bold text-xs shadow-md">
                              Edit Canvas Design
                            </span>
                          </div>
                          <div className="text-center text-xs text-slate-400 font-mono scale-90 pointer-events-none p-4">
                            <div className="font-bold mb-1 uppercase text-[10px] tracking-wider text-slate-500">
                              {design.category}
                            </div>
                            <div className="line-clamp-2 text-slate-700 font-semibold mb-2 text-sm leading-tight">
                              {design.title}
                            </div>
                            <div className="text-[10px] text-slate-400 font-normal uppercase">
                              Created: {new Date(design.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="p-5 flex items-center justify-between gap-3">
                          <div>
                            <h4 className="font-display font-bold text-slate-900 text-sm truncate max-w-[160px]">
                              {design.title}
                            </h4>
                            <span className="text-[10px] font-mono text-slate-400 block mt-0.5 uppercase">
                              {design.category} Proportions
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditDesign(design)}
                              title="Edit Design Layout"
                              className="p-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-100 rounded-xl transition-all"
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
                              className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-gray-200 hover:border-rose-100 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-gray-200/60 p-12 text-center max-w-xl mx-auto shadow-sm">
                    <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="font-display font-bold text-slate-700 text-base">Your Canvas is Empty</h3>
                    <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                      Start by choosing an official preset wedding, document, or form layout, customize the details, and hit Save.
                    </p>
                    <button
                      onClick={() => handleNavigate("templates")}
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold mt-5 transition-all active:scale-95 shadow-md"
                    >
                      Create Your First Design
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      ) : (
        /* Render administrator-only control board, with Certificate Builder & Bulk engine */
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
      <Footer />

      {/* Dynamic Login / Sign Up Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
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

      {/* Floating Guest Login Prompt Timer (Bottom Right Corner) */}
      {!user && (
        <div 
          id="guest-login-timer" 
          className="fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-md border border-slate-200/85 shadow-2xl rounded-2xl p-4 flex items-center gap-3.5 transition-all duration-300 hover:scale-102"
        >
          <div className="w-11 h-11 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center relative shrink-0">
            <span className="text-xs font-black text-indigo-700 font-mono">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </span>
            {/* Glowing active indicator */}
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 leading-tight">Guest Session Timer</h4>
            <p className="text-[10px] text-slate-500 mt-1">
              Please <button onClick={() => setIsLoginOpen(true)} className="text-indigo-600 hover:text-indigo-700 hover:underline font-extrabold focus:outline-none">Sign In</button> to unlock full saving.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
