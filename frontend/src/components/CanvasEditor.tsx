import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, Save, Download, Plus, Trash2, AlignLeft, 
  AlignCenter, AlignRight, AlignJustify, Type as TypeIcon, Square, Award, Copy, Check, Loader2,
  RotateCw, Lock, Unlock, Layers, Undo2, Redo2, Image as ImageIcon, Grid, Ruler, 
  ZoomIn, ZoomOut, Maximize, Sparkles, ArrowUp, ArrowDown, ChevronRight, Sliders, Palette,
  CopyPlus, CheckSquare, Compass, Gift, Heart, Star, Mail, MapPin, Smile, Globe, Info, HelpCircle
} from "lucide-react";
import { Template, CanvasElement, User, TemplateCategory } from "../types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// High-fidelity style-sheet sanitization helper for html2canvas
const safeHtml2Canvas = async (element: HTMLElement, options: any): Promise<HTMLCanvasElement> => {
  const tempStyleElements: HTMLStyleElement[] = [];
  const disabledOriginalElements: (HTMLStyleElement | HTMLLinkElement)[] = [];

  try {
    const styleElements = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
    for (const el of styleElements) {
      try {
        let cssText = "";
        if (el.tagName.toLowerCase() === 'style') {
          cssText = el.textContent || "";
        } else if (el.tagName.toLowerCase() === 'link') {
          const href = (el as HTMLLinkElement).href;
          if (href && href.startsWith(window.location.origin)) {
            const res = await fetch(href);
            if (res.ok) {
              cssText = await res.text();
            }
          }
        }
        if (cssText && cssText.includes("oklch")) {
          const sanitizedCss = cssText.replace(/oklch\([^)]+\)/g, (match) => {
            if (match.includes("/")) {
              const parts = match.split("/");
              const opacity = parts[1].replace(/\)/g, "").trim();
              return `rgba(79, 70, 229, ${opacity})`;
            }
            return '#4f46e5';
          });
          
          const tempStyle = document.createElement('style');
          tempStyle.setAttribute('data-html2canvas-temp', 'true');
          tempStyle.textContent = sanitizedCss;
          document.head.appendChild(tempStyle);
          tempStyleElements.push(tempStyle);
          
          if (el.tagName.toLowerCase() === 'style') {
            (el as HTMLStyleElement).disabled = true;
          } else {
            (el as HTMLLinkElement).disabled = true;
          }
          disabledOriginalElements.push(el as HTMLStyleElement | HTMLLinkElement);
        }
      } catch (err) {
        console.warn("Could not sanitize stylesheet:", el, err);
      }
    }
    return await html2canvas(element, options);
  } finally {
    tempStyleElements.forEach(el => el.remove());
    disabledOriginalElements.forEach(el => {
      el.disabled = false;
    });
  }
};

interface CanvasEditorProps {
  template: Template;
  user: User | null;
  onSave: (title: string, backgroundColor: string, elements: CanvasElement[]) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
  onLoginPrompt: () => void;
}

// Built-in Stickers SVG Library (scalable vectors that export crisp)
const STICKERS = [
  {
    id: "sticker-gold-crown",
    name: "Golden Crown",
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12">
        <path d="M15 75 L20 35 L40 55 L50 25 L60 55 L80 35 L85 75 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="4" strokeLinejoin="round"/>
        <circle cx="20" cy="30" r="4" fill="#F59E0B" />
        <circle cx="50" cy="20" r="4" fill="#F59E0B" />
        <circle cx="80" cy="30" r="4" fill="#F59E0B" />
        <ellipse cx="50" cy="75" rx="35" ry="5" fill="#D97706" />
      </svg>
    )
  },
  {
    id: "sticker-sparkles-gold",
    name: "Retro Sparkles",
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12">
        <path d="M50 15 Q50 50 15 50 Q50 50 50 85 Q50 50 85 50 Q50 50 50 15 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="3"/>
        <path d="M25 20 Q25 35 10 35 Q25 35 25 50 Q25 35 40 35 Q25 35 25 20 Z" fill="#FEF08A" />
        <circle cx="75" cy="70" r="5" fill="#FDE047" />
        <circle cx="70" cy="25" r="3" fill="#CA8A04" />
      </svg>
    )
  },
  {
    id: "sticker-cute-cloud",
    name: "Happy Cloud",
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12">
        <path d="M25 60 A15 15 0 0 1 40 45 A20 20 0 0 1 70 45 A15 15 0 0 1 85 60 A12 12 0 0 1 75 72 L25 72 A12 12 0 0 1 25 60 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="4" strokeLinejoin="round"/>
        <circle cx="45" cy="58" r="2.5" fill="#0369A1" />
        <circle cx="65" cy="58" r="2.5" fill="#0369A1" />
        <path d="M52 64 Q55 67 58 64" fill="none" stroke="#0369A1" strokeWidth="2.5" strokeLinecap="round"/>
        <ellipse cx="38" cy="62" rx="4" ry="2" fill="#F472B6" opacity="0.6"/>
        <ellipse cx="72" cy="62" rx="4" ry="2" fill="#F472B6" opacity="0.6"/>
      </svg>
    )
  },
  {
    id: "sticker-retro-banner",
    name: "Classic Banner",
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12">
        <path d="M10 50 L25 40 L25 60 Z" fill="#B91C1C"/>
        <path d="M90 50 L75 40 L75 60 Z" fill="#B91C1C"/>
        <rect x="20" y="38" width="60" height="24" rx="2" fill="#EF4444" stroke="#991B1B" strokeWidth="3"/>
        <path d="M30 50 L70 50" stroke="#FEE2E2" strokeWidth="2" strokeDasharray="2 2" />
      </svg>
    )
  },
  {
    id: "sticker-rustic-heart",
    name: "Charming Heart",
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12">
        <path d="M50 80 C15 50 15 25 50 25 C85 25 85 50 50 80 Z" fill="#FECDD3" stroke="#E11D48" strokeWidth="4" strokeLinejoin="round"/>
        <path d="M35 38 Q42 34 45 42" fill="none" stroke="#FDA4AF" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: "sticker-vintage-wreath",
    name: "Eucalyptus Loop",
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12">
        <circle cx="50" cy="50" r="35" fill="none" stroke="#059669" strokeWidth="2" strokeDasharray="5 3" />
        <path d="M17 40 Q12 43 18 48 C20 44 17 40 17 40 Z" fill="#34D399"/>
        <path d="M83 40 Q88 43 82 48 C80 44 83 40 83 40 Z" fill="#34D399"/>
        <path d="M50 12 Q55 7 50 18 C45 15 50 12 50 12 Z" fill="#10B981"/>
        <path d="M50 88 Q55 93 50 82 C45 85 50 88 50 88 Z" fill="#10B981"/>
      </svg>
    )
  }
];

// Rich Library of Beautiful Vector Icons (custom crisp rendering)
const ICONS_LIBRARY = [
  { name: "Heart", component: Heart, path: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" },
  { name: "Star", component: Star, path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
  { name: "Award", component: Award, path: "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm-4 4.5l1.5-3.5h5l1.5 3.5-4 2-4-2z" },
  { name: "Sparkles", component: Sparkles, path: "M12 3v3m0 12v3M3 12h3m12 0h3" },
  { name: "Gift", component: Gift, path: "M20 12v10H4V12M22 7H2v5h20V7zM12 7V2" },
  { name: "Mail", component: Mail, path: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 4l8 5 8-5" },
  { name: "Compass", component: Compass, path: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" },
  { name: "Globe", component: Globe, path: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 20a10 10 0 0 1 0-20z" },
  { name: "Smile", component: Smile, path: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zM8 9h.01M16 9h.01M8.5 14a5.5 5.5 0 0 0 7 0" },
  { name: "MapPin", component: MapPin, path: "M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" }
];

// Beautiful Preset Linear/Radial Background Gradients
const PRESET_GRADIENTS = [
  { name: "Warm Sunset", css: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)", colors: ["#FF6B6B", "#FF8E53"] },
  { name: "Royal Lavender", css: "linear-gradient(135deg, #7C3AED 0%, #C084FC 100%)", colors: ["#7C3AED", "#C084FC"] },
  { name: "Emerald Forest", css: "linear-gradient(135deg, #059669 0%, #34D399 100%)", colors: ["#059669", "#34D399"] },
  { name: "Midnight Ocean", css: "linear-gradient(135deg, #0F172A 0%, #2563EB 100%)", colors: ["#0F172A", "#2563EB"] },
  { name: "Golden Rose", css: "linear-gradient(135deg, #FDF2F8 0%, #FBCFE8 50%, #FDE68A 100%)", colors: ["#FDF2F8", "#FDE68A"] },
  { name: "Cosmic Charcoal", css: "linear-gradient(135deg, #111827 0%, #374151 100%)", colors: ["#111827", "#374151"] }
];

// High quality stock image suggestions (using robust Unsplash safe urls)
const STOCK_PHOTOS = [
  { name: "Elegance Floral", url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80" },
  { name: "Minimalist Studio", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" },
  { name: "Golden Wedding Ring", url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80" },
  { name: "Modern Office Workspace", url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80" },
  { name: "Clean Geometric Abstract", url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&q=80" }
];

export default function CanvasEditor({
  template,
  user,
  onSave,
  onClose,
  isSaving,
  onLoginPrompt
}: CanvasEditorProps) {
  const [title, setTitle] = useState(template.title);
  const [backgroundColor, setBackgroundColor] = useState(template.backgroundColor);
  const [backgroundGradient, setBackgroundGradient] = useState<string | undefined>(template.backgroundGradient);
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(template.backgroundImage);
  const [elements, setElements] = useState<CanvasElement[]>(JSON.parse(JSON.stringify(template.elements)));
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Undo/Redo tracking state stacks
  const [history, setHistory] = useState<{ elements: CanvasElement[]; backgroundColor: string; backgroundGradient?: string; backgroundImage?: string }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Canvas View scaling/zoom
  const [zoom, setZoom] = useState<number>(0.9); // Scale: 0.5 to 1.5
  const [gridEnabled, setGridEnabled] = useState<boolean>(false);
  const [rulersEnabled, setRulersEnabled] = useState<boolean>(true);
  
  // Left panel navigation tabs
  const [activeTab, setActiveTab] = useState<'templates' | 'text' | 'uploads' | 'elements' | 'background' | 'layers'>('text');

  // Dragging and transform active states
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeHandle, setActiveHandle] = useState<string | null>(null); // tl, tr, bl, br, r, l, t, b, rotate
  const [resizeStart, setResizeStart] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    mouseX: number;
    mouseY: number;
    rotate?: number;
  } | null>(null);

  // Search filter for elements tab
  const [iconSearchQuery, setIconSearchQuery] = useState("");

  // Snapping Guides State
  const [snapGuides, setSnapGuides] = useState<{ x?: number; y?: number } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [copiedHtml, setCopiedHtml] = useState(false);

  // Save initial step on mount
  useEffect(() => {
    const initialStep = { 
      elements: JSON.parse(JSON.stringify(template.elements)),
      backgroundColor: template.backgroundColor,
      backgroundGradient: template.backgroundGradient,
      backgroundImage: template.backgroundImage
    };
    setHistory([initialStep]);
    setHistoryIndex(0);
  }, [template]);

  // Set default selected element if exists
  useEffect(() => {
    if (elements.length > 0 && !selectedElementId) {
      setSelectedElementId(elements[0].id);
    }
  }, [elements, selectedElementId]);

  const selectedElement = elements.find(el => el.id === selectedElementId);

  // Save step into history stack (max 30 steps)
  const pushHistory = (newElements: CanvasElement[], newBgColor: string, newBgGradient?: string, newBgImage?: string) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    const step = { 
      elements: JSON.parse(JSON.stringify(newElements)), 
      backgroundColor: newBgColor,
      backgroundGradient: newBgGradient,
      backgroundImage: newBgImage
    };
    const updatedHistory = [...nextHistory, step].slice(-30);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevStep = history[prevIndex];
      setElements(JSON.parse(JSON.stringify(prevStep.elements)));
      setBackgroundColor(prevStep.backgroundColor);
      setBackgroundGradient(prevStep.backgroundGradient);
      setBackgroundImage(prevStep.backgroundImage);
      setHistoryIndex(prevIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextStep = history[nextIndex];
      setElements(JSON.parse(JSON.stringify(nextStep.elements)));
      setBackgroundColor(nextStep.backgroundColor);
      setBackgroundGradient(nextStep.backgroundGradient);
      setBackgroundImage(nextStep.backgroundImage);
      setHistoryIndex(nextIndex);
    }
  };

  // Duplicate active element
  const handleDuplicateElement = (el: CanvasElement) => {
    if (!el) return;
    const newId = `el-${Date.now()}`;
    const duplicated: CanvasElement = {
      ...JSON.parse(JSON.stringify(el)),
      id: newId,
      x: Math.min(90, el.x + 4),
      y: Math.min(90, el.y + 4),
      locked: false
    };
    const nextElements = [...elements, duplicated];
    setElements(nextElements);
    setSelectedElementId(newId);
    pushHistory(nextElements, backgroundColor, backgroundGradient, backgroundImage);
  };

  // Keyboard nudge / hotkey handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId && selectedElement && !selectedElement.locked) {
          e.preventDefault();
          handleDeleteElement(selectedElementId);
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (selectedElement) {
          handleDuplicateElement(selectedElement);
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }

      // Arrows to nudge coordinates by 1%
      if (selectedElementId && selectedElement && !selectedElement.locked) {
        let step = 1;
        if (e.shiftKey) step = 5;

        let updatedX = selectedElement.x;
        let updatedY = selectedElement.y;
        let handled = false;

        if (e.key === 'ArrowUp') { updatedY = Math.max(0, selectedElement.y - step); handled = true; }
        if (e.key === 'ArrowDown') { updatedY = Math.min(100 - (selectedElement.height || 5), selectedElement.y + step); handled = true; }
        if (e.key === 'ArrowLeft') { updatedX = Math.max(0, selectedElement.x - step); handled = true; }
        if (e.key === 'ArrowRight') { updatedX = Math.min(100 - (selectedElement.width || 10), selectedElement.x + step); handled = true; }

        if (handled) {
          e.preventDefault();
          const nextElements = elements.map(el => el.id === selectedElementId ? { ...el, x: Math.round(updatedX), y: Math.round(updatedY) } : el);
          setElements(nextElements);
          pushHistory(nextElements, backgroundColor, backgroundGradient, backgroundImage);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, elements, backgroundColor, backgroundGradient, backgroundImage, historyIndex, history]);

  // Alignments relative to canvas
  const alignElement = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (!selectedElementId || !selectedElement || selectedElement.locked) return;
    const w = selectedElement.width || 40;
    const h = selectedElement.height || 10;
    let nextX = selectedElement.x;
    let nextY = selectedElement.y;

    if (alignment === 'left') nextX = 0;
    if (alignment === 'center') nextX = Math.round(50 - w / 2);
    if (alignment === 'right') nextX = Math.round(100 - w);
    if (alignment === 'top') nextY = 0;
    if (alignment === 'middle') nextY = Math.round(50 - h / 2);
    if (alignment === 'bottom') nextY = Math.round(100 - h);

    const nextElements = elements.map(el => {
      if (el.id === selectedElementId) {
        return { ...el, x: nextX, y: nextY };
      }
      return el;
    });
    setElements(nextElements);
    pushHistory(nextElements, backgroundColor, backgroundGradient, backgroundImage);
  };

  // Add customized shapes, badges, text types, icons and stickers
  const handleAddTextElement = (preset: 'heading' | 'subheading' | 'body' | 'script') => {
    const newId = `el-${Date.now()}`;
    let style: Partial<CanvasElement> = {};
    
    if (preset === 'heading') {
      style = { text: "Add a heading", fontSize: 28, fontFamily: "display", fontWeight: "bold", color: "#0F172A" };
    } else if (preset === 'subheading') {
      style = { text: "Add a subheading", fontSize: 18, fontFamily: "sans", fontWeight: "semibold", color: "#475569" };
    } else if (preset === 'body') {
      style = { text: "This is body text. Custom editing is simple and fast.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#64748B" };
    } else if (preset === 'script') {
      style = { text: "Exclusive Design Style", fontSize: 24, fontFamily: "serif", italic: true, fontWeight: "normal", color: "#C084FC" };
    }

    const newElement: CanvasElement = {
      id: newId,
      type: "text",
      x: 25,
      y: 40,
      width: 50,
      height: 10,
      align: "center",
      opacity: 100,
      rotate: 0,
      locked: false,
      ...style
    };

    const nextElements = [...elements, newElement];
    setElements(nextElements);
    setSelectedElementId(newId);
    pushHistory(nextElements, backgroundColor, backgroundGradient, backgroundImage);
  };

  const handleAddShape = (shapeType: 'rectangle' | 'circle' | 'triangle' | 'star' | 'heart' | 'line') => {
    const newId = `el-${Date.now()}`;
    const newElement: CanvasElement = {
      id: newId,
      type: "shape",
      shapeType,
      backgroundColor: shapeType === 'line' ? "#E2E8F0" : "#818CF8",
      x: 35,
      y: 45,
      width: shapeType === 'line' ? 30 : 25,
      height: shapeType === 'line' ? 1 : 25,
      opacity: 100,
      rotate: 0,
      locked: false
    };

    const nextElements = [...elements, newElement];
    setElements(nextElements);
    setSelectedElementId(newId);
    pushHistory(nextElements, backgroundColor, backgroundGradient, backgroundImage);
  };

  const handleAddSticker = (stickerUrl: string) => {
    const newId = `el-${Date.now()}`;
    const newElement: CanvasElement = {
      id: newId,
      type: "sticker",
      stickerUrl,
      x: 35,
      y: 40,
      width: 25,
      height: 25,
      opacity: 100,
      rotate: 0,
      locked: false
    };
    const nextElements = [...elements, newElement];
    setElements(nextElements);
    setSelectedElementId(newId);
    pushHistory(nextElements, backgroundColor, backgroundGradient, backgroundImage);
  };

  const handleAddIcon = (iconName: string) => {
    const newId = `el-${Date.now()}`;
    const newElement: CanvasElement = {
      id: newId,
      type: "icon",
      iconName,
      color: "#4F46E5",
      x: 45,
      y: 45,
      width: 10,
      height: 10,
      opacity: 100,
      rotate: 0,
      locked: false
    };
    const nextElements = [...elements, newElement];
    setElements(nextElements);
    setSelectedElementId(newId);
    pushHistory(nextElements, backgroundColor, backgroundGradient, backgroundImage);
  };

  // Image Upload Handler
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      const newId = `el-${Date.now()}`;
      const newElement: CanvasElement = {
        id: newId,
        type: "image",
        imageUrl: dataUrl,
        x: 20,
        y: 25,
        width: 60,
        height: 50,
        opacity: 100,
        rotate: 0,
        locked: false,
        lineHeight: 1.0, // Used for Image Zoom Crop factor
        cropX: 0,
        cropY: 0,
        cropWidth: 100,
        cropHeight: 100,
        borderRadius: "lg"
      };

      const nextElements = [...elements, newElement];
      setElements(nextElements);
      setSelectedElementId(newId);
      pushHistory(nextElements, backgroundColor, backgroundGradient, backgroundImage);
    };
    reader.readAsDataURL(file);
  };

  const handleAddStockPhoto = (url: string) => {
    const newId = `el-${Date.now()}`;
    const newElement: CanvasElement = {
      id: newId,
      type: "image",
      imageUrl: url,
      x: 20,
      y: 25,
      width: 60,
      height: 50,
      opacity: 100,
      rotate: 0,
      locked: false,
      lineHeight: 1.0,
      cropX: 0,
      cropY: 0,
      cropWidth: 100,
      cropHeight: 100,
      borderRadius: "lg"
    };
    const nextElements = [...elements, newElement];
    setElements(nextElements);
    setSelectedElementId(newId);
    pushHistory(nextElements, backgroundColor, backgroundGradient, backgroundImage);
  };

  const handleDeleteElement = (id: string) => {
    const remaining = elements.filter(el => el.id !== id);
    setElements(remaining);
    if (selectedElementId === id) {
      setSelectedElementId(remaining.length > 0 ? remaining[0].id : null);
    }
    pushHistory(remaining, backgroundColor, backgroundGradient, backgroundImage);
  };

  const handleUpdateElementProperty = <K extends keyof CanvasElement>(
    id: string,
    key: K,
    value: CanvasElement[K]
  ) => {
    const updated = elements.map(el => {
      if (el.id === id) {
        return { ...el, [key]: value };
      }
      return el;
    });
    setElements(updated);
  };

  const handleUpdatePropertyFinished = () => {
    pushHistory(elements, backgroundColor, backgroundGradient, backgroundImage);
  };

  // Drag handles logic for interactive positioning & sizing
  const handleMouseDown = (e: React.MouseEvent, el: CanvasElement) => {
    if (el.locked) return;
    e.stopPropagation();
    setSelectedElementId(el.id);
    setIsDragging(true);

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickXPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const clickYPercent = ((e.clientY - rect.top) / rect.height) * 100;

    setDragOffset({
      x: clickXPercent - el.x,
      y: clickYPercent - el.y
    });
  };

  // Corner resize handles
  const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!selectedElement || selectedElement.locked || !canvasRef.current) return;

    setActiveHandle(handle);
    setResizeStart({
      x: selectedElement.x,
      y: selectedElement.y,
      width: selectedElement.width || 20,
      height: selectedElement.height || 20,
      mouseX: e.clientX,
      mouseY: e.clientY,
      rotate: selectedElement.rotate || 0
    });
  };

  // Dragging and resizing updates inside viewport
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    // 1. Resizing mathematical mapping
    if (activeHandle && resizeStart && selectedElementId && selectedElement) {
      e.preventDefault();
      
      const dxPx = e.clientX - resizeStart.mouseX;
      const dyPx = e.clientY - resizeStart.mouseY;
      const dxPercent = (dxPx / rect.width) * 100;
      const dyPercent = (dyPx / rect.height) * 100;

      if (activeHandle === 'rotate') {
        // Rotation Angle Map
        const elCenterX = rect.left + ((resizeStart.x + resizeStart.width / 2) / 100) * rect.width;
        const elCenterY = rect.top + ((resizeStart.y + resizeStart.height / 2) / 100) * rect.height;
        const angleRad = Math.atan2(e.clientY - elCenterY, e.clientX - elCenterX);
        let angleDeg = Math.round(angleRad * (180 / Math.PI)) + 90;
        if (angleDeg < 0) angleDeg += 360;
        
        handleUpdateElementProperty(selectedElementId, 'rotate', angleDeg % 360);
        return;
      }

      let nextX = resizeStart.x;
      let nextY = resizeStart.y;
      let nextW = resizeStart.width;
      let nextH = resizeStart.height;

      if (activeHandle.includes('r')) {
        nextW = Math.max(5, resizeStart.width + dxPercent);
      }
      if (activeHandle.includes('l')) {
        const pW = resizeStart.width - dxPercent;
        if (pW >= 5) {
          nextW = pW;
          nextX = resizeStart.x + dxPercent;
        }
      }
      if (activeHandle.includes('b')) {
        nextH = Math.max(2, resizeStart.height + dyPercent);
      }
      if (activeHandle.includes('t')) {
        const pH = resizeStart.height - dyPercent;
        if (pH >= 2) {
          nextH = pH;
          nextY = resizeStart.y + dyPercent;
        }
      }

      // Safe bounds capping
      nextX = Math.max(0, Math.min(100, Math.round(nextX)));
      nextY = Math.max(0, Math.min(100, Math.round(nextY)));
      nextW = Math.max(2, Math.min(100 - nextX, Math.round(nextW)));
      nextH = Math.max(2, Math.min(100 - nextY, Math.round(nextH)));

      setElements(prev => prev.map(el => {
        if (el.id === selectedElementId) {
          return { ...el, x: nextX, y: nextY, width: nextW, height: nextH };
        }
        return el;
      }));
      return;
    }

    // 2. Element Dragging positioning
    if (isDragging && selectedElementId && selectedElement) {
      e.preventDefault();
      
      const mouseXPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseYPercent = ((e.clientY - rect.top) / rect.height) * 100;

      let targetX = mouseXPercent - dragOffset.x;
      let targetY = mouseYPercent - dragOffset.y;

      const elW = selectedElement.width || 10;
      const elH = selectedElement.height || 5;

      // Smart Snapping magnets
      let activeXGuide: number | undefined;
      let activeYGuide: number | undefined;

      // Canvas Center magnets
      const elementCenterX = targetX + elW / 2;
      const elementCenterY = targetY + elH / 2;

      if (Math.abs(elementCenterX - 50) < 1.8) {
        targetX = 50 - elW / 2;
        activeXGuide = 50;
      }
      if (Math.abs(elementCenterY - 50) < 1.8) {
        targetY = 50 - elH / 2;
        activeYGuide = 50;
      }

      // Edge snapping with other elements
      elements.forEach(other => {
        if (other.id === selectedElementId) return;
        
        // Match Left Edge
        if (Math.abs(targetX - other.x) < 1.5) {
          targetX = other.x;
          activeXGuide = other.x;
        }
        // Match Top Edge
        if (Math.abs(targetY - other.y) < 1.5) {
          targetY = other.y;
          activeYGuide = other.y;
        }
      });

      if (activeXGuide !== undefined || activeYGuide !== undefined) {
        setSnapGuides({ x: activeXGuide, y: activeYGuide });
      } else {
        setSnapGuides(null);
      }

      // Bound clamp
      targetX = Math.max(0, Math.min(100 - elW, targetX));
      targetY = Math.max(0, Math.min(100 - elH, targetY));

      setElements(prev => prev.map(el => {
        if (el.id === selectedElementId) {
          return { ...el, x: Math.round(targetX), y: Math.round(targetY) };
        }
        return el;
      }));
    }
  };

  const handleMouseUp = () => {
    if (isDragging || activeHandle) {
      setIsDragging(false);
      setActiveHandle(null);
      setResizeStart(null);
      setSnapGuides(null);
      pushHistory(elements, backgroundColor, backgroundGradient, backgroundImage);
    }
  };

  // High Fidelity PDF / PNG / JPG Export Engine (Canvas Renderer)
  const handleExport = async (format: 'png' | 'jpg' | 'pdf') => {
    const element = document.getElementById("editor-canvas-stage");
    if (!element) return;

    // Deselect element for capturing clean picture
    const previousSelectedId = selectedElementId;
    setSelectedElementId(null);
    setSnapGuides(null);

    // Wait short offset for re-render cycle
    await new Promise(resolve => setTimeout(resolve, 80));

    try {
      const canvas = await safeHtml2Canvas(element, {
        scale: 2.2, // Retina high resolution scaling factor
        useCORS: true,
        backgroundColor: null
      });

      if (format === 'png') {
        const link = document.createElement("a");
        link.download = `${title.toLowerCase().replace(/\s+/g, "-")}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else if (format === 'jpg') {
        const link = document.createElement("a");
        link.download = `${title.toLowerCase().replace(/\s+/g, "-")}.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 0.95); // High quality compressed JPG
        link.click();
      } else if (format === 'pdf') {
        const imgData = canvas.toDataURL("image/png");
        // Create proportional letter landscape/portrait depending on aspect sizes
        const isLandscape = template.width > template.height;
        const pdf = new jsPDF({
          orientation: isLandscape ? "landscape" : "portrait",
          unit: "mm",
          format: "letter"
        });

        const pdfWidth = isLandscape ? 279.4 : 215.9;
        const pdfHeight = isLandscape ? 215.9 : 279.4;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
      }
    } catch (err) {
      console.error("High fidelity export failure:", err);
      alert("An issue occurred during PDF render generation. Please try again.");
    } finally {
      setSelectedElementId(previousSelectedId);
    }
  };

  const handleSaveClick = () => {
    if (!user) {
      alert("Please login first to save this template customization in your portfolio.");
      onLoginPrompt();
      return;
    }
    // Package any gradient or custom visual styling into safe CSS hex or CSS style for back compatibility
    onSave(title, backgroundGradient || backgroundColor, elements);
  };

  // SVG Helper path renderer
  const renderIconPath = (iconName: string) => {
    const item = ICONS_LIBRARY.find(i => i.name === iconName);
    return item ? item.path : "";
  };

  // Dynamic filter lists
  const filteredIcons = ICONS_LIBRARY.filter(ico => 
    ico.name.toLowerCase().includes(iconSearchQuery.toLowerCase())
  );

  return (
    <div id="canvas-editor-panel" className="fixed inset-0 bg-slate-900 z-50 flex flex-col font-sans text-slate-200">
      
      {/* 1. TOP HEADER ACTIONS BAR */}
      <div className="h-16 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between text-white select-none shrink-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            id="editor-back-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <input
              id="editor-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 font-bold focus:outline-none text-sm px-1 py-0.5"
            />
            <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-mono font-bold px-1 mt-0.5">
              Canvas Size: {template.width} × {template.height} px
            </span>
          </div>
        </div>

        {/* Undo/Redo / Grid Toggles toolbar section */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300 disabled:opacity-30 disabled:pointer-events-none"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300 disabled:opacity-30 disabled:pointer-events-none"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-slate-800 mx-2"></div>
          
          <button
            onClick={() => setGridEnabled(!gridEnabled)}
            className={`p-1.5 rounded transition-colors ${gridEnabled ? "bg-indigo-900/60 text-indigo-300 border border-indigo-700/50" : "hover:bg-slate-800 text-slate-300"}`}
            title="Toggle Alignment Grid"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRulersEnabled(!rulersEnabled)}
            className={`p-1.5 rounded transition-colors ${rulersEnabled ? "bg-indigo-900/60 text-indigo-300 border border-indigo-700/50" : "hover:bg-slate-800 text-slate-300"}`}
            title="Toggle Metric Rulers"
          >
            <Ruler className="w-4 h-4" />
          </button>
        </div>

        {/* High-fidelity formats downloads menu */}
        <div className="flex items-center gap-2">
          <div className="relative group">
            <button
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export Design</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden invisible group-hover:visible transition-all duration-200 opacity-0 group-hover:opacity-100 z-50">
              <button
                onClick={() => handleExport('png')}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-between"
              >
                <span>Download as PNG</span>
                <span className="text-[9px] bg-slate-900 text-slate-400 px-1 py-0.5 rounded uppercase font-mono">High-Res</span>
              </button>
              <button
                onClick={() => handleExport('jpg')}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-between"
              >
                <span>Download as JPEG</span>
                <span className="text-[9px] bg-slate-900 text-slate-400 px-1 py-0.5 rounded uppercase font-mono">95% Q</span>
              </button>
              <div className="h-px bg-slate-800"></div>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-between"
              >
                <span>Download Vector PDF</span>
                <span className="text-[9px] bg-indigo-950 text-indigo-400 px-1 py-0.5 rounded uppercase font-mono">Letter</span>
              </button>
            </div>
          </div>

          <button
            id="editor-save-btn"
            onClick={handleSaveClick}
            disabled={isSaving}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? "Saving..." : "Save Custom"}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN SPLIT MULTI-TAB WORKSPACE CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT TAB BAR SELECTION RAIL */}
        <div className="w-16 border-r border-slate-800 bg-slate-950 flex flex-col items-center py-4 gap-4 shrink-0 select-none">
          <button
            onClick={() => setActiveTab('text')}
            className={`p-2.5 rounded-xl transition-all flex flex-col items-center gap-1 ${activeTab === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <TypeIcon className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Text</span>
          </button>
          
          <button
            onClick={() => setActiveTab('uploads')}
            className={`p-2.5 rounded-xl transition-all flex flex-col items-center gap-1 ${activeTab === 'uploads' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Uploads</span>
          </button>

          <button
            onClick={() => setActiveTab('elements')}
            className={`p-2.5 rounded-xl transition-all flex flex-col items-center gap-1 ${activeTab === 'elements' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Square className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Shapes</span>
          </button>

          <button
            onClick={() => setActiveTab('background')}
            className={`p-2.5 rounded-xl transition-all flex flex-col items-center gap-1 ${activeTab === 'background' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Palette className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Canvas</span>
          </button>

          <button
            onClick={() => setActiveTab('layers')}
            className={`p-2.5 rounded-xl transition-all flex flex-col items-center gap-1 relative ${activeTab === 'layers' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Layers</span>
            <span className="absolute top-1 right-1 w-4 h-4 bg-slate-800 text-slate-300 rounded-full text-[8px] flex items-center justify-center font-bold">
              {elements.length}
            </span>
          </button>
        </div>

        {/* ACTIVE TAB DISPLAY PANEL */}
        <div className="w-72 border-r border-slate-800 bg-slate-950 flex flex-col shrink-0 select-none p-4 overflow-y-auto">
          
          {/* TAB 1: TEXT PRESETS */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div className="mb-2">
                <h3 className="font-display font-bold text-sm text-white">Typography Blocks</h3>
                <p className="text-[10px] text-slate-500">Click to append stylized formatting boxes to stage.</p>
              </div>

              <button
                onClick={() => handleAddTextElement('heading')}
                className="w-full p-4 bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-xl text-left transition-all hover:bg-slate-800/80"
              >
                <span className="font-display font-bold text-xl text-white block">Add a Heading</span>
                <span className="text-[9px] text-indigo-400 uppercase font-mono">Space Grotesk Bold</span>
              </button>

              <button
                onClick={() => handleAddTextElement('subheading')}
                className="w-full p-3.5 bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-xl text-left transition-all hover:bg-slate-800/80"
              >
                <span className="font-sans font-semibold text-sm text-slate-300 block">Add a Subheading</span>
                <span className="text-[9px] text-slate-500 uppercase font-mono">Inter Semibold</span>
              </button>

              <button
                onClick={() => handleAddTextElement('body')}
                className="w-full p-3 bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-xl text-left transition-all hover:bg-slate-800/80"
              >
                <span className="font-sans text-xs text-slate-400 block line-clamp-1">Add body text. Quick description or details template.</span>
                <span className="text-[9px] text-slate-500 uppercase font-mono">Inter Normal</span>
              </button>

              <button
                onClick={() => handleAddTextElement('script')}
                className="w-full p-3.5 bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-xl text-left transition-all hover:bg-slate-800/80"
              >
                <span className="font-serif italic text-lg text-fuchsia-300 block">Add Serene Script</span>
                <span className="text-[9px] text-fuchsia-400 uppercase font-mono">Playfair Display Italic</span>
              </button>
            </div>
          )}

          {/* TAB 2: UPLOADS & STOCK IMAGES */}
          {activeTab === 'uploads' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display font-bold text-sm text-white">Image Upload Center</h3>
                <p className="text-[10px] text-slate-500">Insert custom photos or choose royalty-free assets.</p>
              </div>

              {/* Upload input */}
              <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500 bg-slate-900 hover:bg-slate-900/60 transition-colors rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLocalImageUpload}
                  className="hidden"
                />
                <Plus className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200">Upload Image File</span>
                <span className="text-[9px] text-slate-500">Supports PNG, JPG, WebP</span>
              </label>

              {/* Stock photo recommendations */}
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Preset Stock Library</h4>
                <div className="grid grid-cols-2 gap-2">
                  {STOCK_PHOTOS.map((pho, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddStockPhoto(pho.url)}
                      className="group relative h-16 rounded-lg overflow-hidden border border-slate-800 hover:border-indigo-500 focus:outline-none cursor-pointer"
                      title={pho.name}
                    >
                      <img
                        src={pho.url}
                        alt={pho.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-250"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-1 text-[8px] text-slate-300 truncate font-semibold">
                        {pho.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SHAPES, ICONS, STICKERS */}
          {activeTab === 'elements' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display font-bold text-sm text-white">Shapes & Graphics</h3>
                <p className="text-[10px] text-slate-500">Enhance your templates with vector stamps.</p>
              </div>

              {/* Shapes grid */}
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Standard Shapes</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleAddShape('rectangle')}
                    className="flex flex-col items-center gap-1 p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-[10px] font-semibold text-slate-300 border border-slate-800 hover:border-indigo-500 cursor-pointer"
                  >
                    <div className="w-6 h-4 bg-indigo-500 rounded"></div>
                    <span>Stripe</span>
                  </button>
                  <button
                    onClick={() => handleAddShape('circle')}
                    className="flex flex-col items-center gap-1 p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-[10px] font-semibold text-slate-300 border border-slate-800 hover:border-indigo-500 cursor-pointer"
                  >
                    <div className="w-5 h-5 bg-indigo-500 rounded-full"></div>
                    <span>Circle</span>
                  </button>
                  <button
                    onClick={() => handleAddShape('line')}
                    className="flex flex-col items-center gap-1 p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-[10px] font-semibold text-slate-300 border border-slate-800 hover:border-indigo-500 cursor-pointer"
                  >
                    <div className="w-6 h-1 bg-slate-400 my-2"></div>
                    <span>Separator</span>
                  </button>
                </div>
              </div>

              {/* Vector Stickers */}
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Adorable Stickers</h4>
                <div className="grid grid-cols-3 gap-2">
                  {STICKERS.map((stk) => (
                    <button
                      key={stk.id}
                      onClick={() => handleAddSticker(stk.id)}
                      className="flex items-center justify-center p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 rounded-xl cursor-pointer"
                      title={stk.name}
                    >
                      {stk.svg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Searchable icons */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Vector Icons</h4>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={iconSearchQuery}
                    onChange={(e) => setIconSearchQuery(e.target.value)}
                    className="w-24 px-1.5 py-0.5 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded text-[9px] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {filteredIcons.map((ico, idx) => {
                    const Comp = ico.component;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAddIcon(ico.name)}
                        className="flex items-center justify-center p-2 bg-slate-900 hover:bg-indigo-600 hover:text-white rounded-lg border border-slate-800 transition-colors cursor-pointer"
                        title={ico.name}
                      >
                        <Comp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CANVAS BACKGROUND STYLING */}
          {activeTab === 'background' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display font-bold text-sm text-white">Canvas Layout Canvas</h3>
                <p className="text-[10px] text-slate-500">Pick background gradients or custom solid fills.</p>
              </div>

              {/* solid fill color */}
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Solid Canvas Color</h4>
                <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => {
                      setBackgroundColor(e.target.value);
                      setBackgroundGradient(undefined);
                      pushHistory(elements, e.target.value, undefined, backgroundImage);
                    }}
                    className="w-10 h-10 border border-slate-700 bg-transparent rounded-lg cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{backgroundColor}</span>
                    <span className="text-[8px] text-slate-500">Standard Solid Hex</span>
                  </div>
                </div>
              </div>

              {/* gradient presets */}
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Elegant Linear Gradients</h4>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_GRADIENTS.map((gra, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setBackgroundGradient(gra.css);
                        pushHistory(elements, backgroundColor, gra.css, backgroundImage);
                      }}
                      className="h-10 rounded-lg border border-slate-800 hover:border-indigo-500 focus:outline-none relative overflow-hidden flex items-center justify-center cursor-pointer"
                      style={{ background: gra.css }}
                    >
                      <span className="text-[8px] font-bold text-white px-1.5 py-0.5 bg-slate-950/40 rounded truncate max-w-[90%]">
                        {gra.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* custom gradient generator */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2.5">
                <h5 className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Custom Dual Gradient</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-slate-500">Start Color</span>
                    <input
                      type="color"
                      value={PRESET_GRADIENTS[0].colors[0]}
                      onChange={(e) => {
                        const nextGra = `linear-gradient(135deg, ${e.target.value}, ${backgroundColor})`;
                        setBackgroundGradient(nextGra);
                        pushHistory(elements, backgroundColor, nextGra, backgroundImage);
                      }}
                      className="w-full h-7 rounded border border-slate-800 bg-transparent cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-slate-500">End Color</span>
                    <input
                      type="color"
                      value={PRESET_GRADIENTS[0].colors[1]}
                      onChange={(e) => {
                        const nextGra = `linear-gradient(135deg, ${backgroundColor}, ${e.target.value})`;
                        setBackgroundGradient(nextGra);
                        pushHistory(elements, backgroundColor, nextGra, backgroundImage);
                      }}
                      className="w-full h-7 rounded border border-slate-800 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Background Clear options */}
              <button
                onClick={() => {
                  setBackgroundGradient(undefined);
                  setBackgroundImage(undefined);
                  setBackgroundColor("#FFFFFF");
                  pushHistory(elements, "#FFFFFF", undefined, undefined);
                }}
                className="w-full py-1.5 text-center bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-300 cursor-pointer"
              >
                Reset Background to Plain White
              </button>
            </div>
          )}

          {/* TAB 5: LAYERS z-INDEX CONFIGURATION */}
          {activeTab === 'layers' && (
            <div className="space-y-4">
              <div className="mb-2">
                <h3 className="font-display font-bold text-sm text-white">Template Layers</h3>
                <p className="text-[10px] text-slate-500">Manage depth order stacks and locking states.</p>
              </div>

              {elements.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-600 font-medium">
                  No elements on stage. Append elements to view layers.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                  {[...elements].reverse().map((el, revIdx) => {
                    const actualIdx = elements.length - 1 - revIdx;
                    const isSelected = el.id === selectedElementId;
                    
                    return (
                      <div
                        key={el.id}
                        className={`p-2 rounded-xl flex items-center justify-between border transition-all cursor-pointer ${isSelected ? "bg-indigo-950/60 border-indigo-500" : "bg-slate-900 border-slate-800/80 hover:bg-slate-900/60"}`}
                        onClick={() => setSelectedElementId(el.id)}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-[9px] bg-slate-950 text-slate-500 px-1 py-0.5 rounded font-mono shrink-0 font-bold">
                            #{elements.length - revIdx}
                          </span>
                          <span className="text-xs font-semibold text-slate-200 truncate capitalize">
                            {el.type === 'text' ? (el.text || 'Text Field') : el.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* lock */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateElementProperty(el.id, 'locked', !el.locked);
                              pushHistory(elements, backgroundColor, backgroundGradient, backgroundImage);
                            }}
                            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                            title={el.locked ? "Unlock layer" : "Lock layer"}
                          >
                            {el.locked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>

                          {/* z-index swap operations */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (actualIdx < elements.length - 1) {
                                const nextElements = [...elements];
                                const temp = nextElements[actualIdx];
                                nextElements[actualIdx] = nextElements[actualIdx + 1];
                                nextElements[actualIdx + 1] = temp;
                                setElements(nextElements);
                                pushHistory(nextElements, backgroundColor, backgroundGradient, backgroundImage);
                              }
                            }}
                            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                            title="Bring forward"
                            disabled={actualIdx === elements.length - 1}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (actualIdx > 0) {
                                const nextElements = [...elements];
                                const temp = nextElements[actualIdx];
                                nextElements[actualIdx] = nextElements[actualIdx - 1];
                                nextElements[actualIdx - 1] = temp;
                                setElements(nextElements);
                                pushHistory(nextElements, backgroundColor, backgroundGradient, backgroundImage);
                              }
                            }}
                            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                            title="Send backward"
                            disabled={actualIdx === 0}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteElement(el.id);
                            }}
                            className="p-1 hover:bg-rose-950 rounded text-slate-500 hover:text-rose-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. CENTER DYNAMIC CANVAS WORKSTAGE (RULERS AND VIEWPORTS) */}
        <div 
          className="flex-1 bg-slate-900 overflow-auto flex items-center justify-center select-none relative"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          
          {/* Zoom controls floating badge */}
          <div className="absolute right-4 bottom-4 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl shadow-2xl flex items-center gap-2.5 z-40 text-xs">
            <button
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
              className="p-1 hover:bg-slate-800 rounded text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-bold text-slate-300 w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
              className="p-1 hover:bg-slate-800 rounded text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-slate-800"></div>
            <button
              onClick={() => setZoom(0.9)}
              className="p-1 hover:bg-slate-800 rounded text-indigo-400 hover:text-indigo-300"
              title="Reset Zoom (90%)"
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* RULERS BAR OVERLAY */}
          {rulersEnabled && (
            <>
              {/* Horizontal Ruler */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-slate-950 border-b border-slate-800/80 flex items-center font-mono text-[7px] text-slate-600 select-none z-30 pointer-events-none overflow-hidden pl-4">
                {Array.from({ length: 30 }).map((_, i) => (
                  <span key={i} className="inline-block shrink-0" style={{ width: "60px", borderLeft: "1px solid #1e293b", paddingLeft: "2px" }}>
                    {i * 100}
                  </span>
                ))}
              </div>
              {/* Vertical Ruler */}
              <div className="absolute top-0 left-0 bottom-0 w-4 bg-slate-950 border-r border-slate-800/80 flex flex-col items-center font-mono text-[7px] text-slate-600 select-none z-30 pointer-events-none overflow-hidden pt-4">
                {Array.from({ length: 40 }).map((_, i) => (
                  <span key={i} className="inline-block shrink-0" style={{ height: "60px", borderTop: "1px solid #1e293b", width: "100%", paddingLeft: "1px" }}>
                    {i * 100}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Sizable Canvas Container */}
          <div
            id="editor-canvas-stage"
            ref={canvasRef}
            className="relative shadow-2xl overflow-hidden border border-slate-800 transition-all rounded"
            style={{ 
              width: `${template.width}px`, 
              height: `${template.height}px`, 
              backgroundColor: backgroundColor,
              background: backgroundGradient || backgroundColor,
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
              minWidth: `${template.width}px`,
              minHeight: `${template.height}px`
            }}
          >
            {/* GRID LINES LAYER */}
            {gridEnabled && (
              <div 
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  backgroundImage: "radial-gradient(#475569 1px, transparent 1.5px)",
                  backgroundSize: "20px 20px"
                }}
              ></div>
            )}

            {/* ELEMENTS LOOP */}
            {elements.map((el) => {
              const isSelected = el.id === selectedElementId;
              const xPos = `${el.x}%`;
              const yPos = `${el.y}%`;
              const elWidth = `${el.width || 40}%`;
              const elHeight = el.height ? `${el.height}%` : "auto";
              const rotationStyle = el.rotate ? `rotate(${el.rotate}deg)` : "none";
              const opacityStyle = el.opacity !== undefined ? el.opacity / 100 : 1;

              return (
                <div
                  key={el.id}
                  id={`canvas-el-${el.id}`}
                  onMouseDown={(e) => handleMouseDown(e, el)}
                  style={{
                    position: "absolute",
                    left: xPos,
                    top: yPos,
                    width: elWidth,
                    height: elHeight,
                    transform: rotationStyle,
                    opacity: opacityStyle,
                    pointerEvents: el.locked ? "none" : "auto"
                  }}
                  className={`transition-shadow ${
                    isSelected 
                      ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent shadow-lg z-30" 
                      : "hover:ring-1 hover:ring-indigo-400 z-20"
                  }`}
                >
                  
                  {/* Element 1: Shapes */}
                  {el.type === "shape" && (
                    <div className="w-full h-full relative" style={{ minHeight: "4px" }}>
                      {el.shapeType === 'circle' ? (
                        <div className="w-full h-full rounded-full" style={{ backgroundColor: el.backgroundColor || "#818CF8" }} />
                      ) : el.shapeType === 'triangle' ? (
                        <div 
                          className="w-full h-full" 
                          style={{
                            width: "0",
                            height: "0",
                            borderLeft: `${(el.width || 20) * 2}px solid transparent`,
                            borderRight: `${(el.width || 20) * 2}px solid transparent`,
                            borderBottom: `${(el.height || 20) * 4}px solid ${el.backgroundColor || "#818CF8"}`
                          }} 
                        />
                      ) : el.shapeType === 'line' ? (
                        <div className="w-full h-1 bg-slate-300" style={{ backgroundColor: el.backgroundColor || "#94A3B8" }} />
                      ) : (
                        <div className="w-full h-full rounded" style={{ backgroundColor: el.backgroundColor || "#818CF8" }} />
                      )}
                    </div>
                  )}

                  {/* Element 2: Badge */}
                  {el.type === "badge" && (
                    <div
                      style={{
                        backgroundColor: el.backgroundColor || "#7C3AED",
                        color: el.color || "#FFFFFF",
                        fontSize: `${el.fontSize || 12}px`,
                        fontWeight: el.fontWeight || "bold",
                        textAlign: "center",
                      }}
                      className={`py-1.5 px-3 whitespace-nowrap overflow-hidden text-ellipsis shadow-sm ${
                        el.borderRadius === "full" ? "rounded-full" : "rounded-lg"
                      }`}
                    >
                      {el.text}
                    </div>
                  )}

                  {/* Element 3: Text Custom Fields */}
                  {el.type === "text" && (
                    <div
                      style={{
                        color: el.color || "#1E293B",
                        fontSize: `${el.fontSize || 16}px`,
                        fontWeight: el.fontWeight || "normal",
                        textAlign: el.align || "center",
                        fontStyle: el.italic ? 'italic' : 'normal',
                        textDecoration: el.underline ? 'underline' : 'none',
                        letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : 'normal',
                        lineHeight: el.lineHeight || 1.2,
                        fontFamily: el.fontFamily === "display" ? "Space Grotesk" : el.fontFamily === "mono" ? "JetBrains Mono" : el.fontFamily === "serif" ? "Playfair Display" : "Inter",
                      }}
                      className="font-medium whitespace-pre-wrap select-none outline-none break-words w-full h-full"
                    >
                      {el.text}
                    </div>
                  )}

                  {/* Element 4: Sticker Illustrators */}
                  {el.type === "sticker" && (
                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                      {STICKERS.find(s => s.id === el.stickerUrl)?.svg || (
                        <svg viewBox="0 0 100 100" className="w-12 h-12">
                          <circle cx="50" cy="50" r="30" fill="#CA8A04" />
                        </svg>
                      )}
                    </div>
                  )}

                  {/* Element 5: Lucide Vector Icons */}
                  {el.type === "icon" && (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={el.color || "#4F46E5"} 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="w-full h-full"
                      >
                        <path d={renderIconPath(el.iconName || "Heart")} />
                      </svg>
                    </div>
                  )}

                  {/* Element 6: Upload Image Frame */}
                  {el.type === "image" && (
                    <div 
                      className={`w-full h-full overflow-hidden relative border border-slate-200/15 ${
                        el.borderRadius === 'full' ? 'rounded-full' : el.borderRadius === 'lg' ? 'rounded-xl' : 'rounded-none'
                      }`}
                    >
                      <img
                        src={el.imageUrl || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600"}
                        alt="Canvas customization content"
                        style={{
                          width: `${(el.lineHeight || 1.0) * 100}%`,
                          height: `${(el.lineHeight || 1.0) * 100}%`,
                          transform: `translate(${el.cropX || 0}%, ${el.cropY || 0}%) rotate(${el.rotate || 0}deg)`
                        }}
                        className="absolute top-0 left-0 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* CORNER TRANSFORMATION HANDLES OVERLAY (Only if selected and NOT locked) */}
                  {isSelected && !el.locked && (
                    <>
                      {/* Bounding Label info */}
                      <div className="absolute -top-6 left-0 bg-indigo-600 text-[9px] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider scale-90 pointer-events-none whitespace-nowrap z-50 shadow">
                        {el.type} Active
                      </div>

                      {/* Rotation handle floating stalk */}
                      <div 
                        onMouseDown={(e) => handleResizeMouseDown(e, 'rotate')}
                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-950 border border-slate-700 hover:border-indigo-500 hover:bg-slate-900 cursor-pointer flex items-center justify-center text-slate-300 hover:text-indigo-400 z-50 shadow"
                        title="Drag to Rotate Element"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </div>

                      {/* Resize Corners */}
                      <div 
                        onMouseDown={(e) => handleResizeMouseDown(e, 'tl')}
                        className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-full cursor-nwse-resize z-50 hover:bg-indigo-600 transition-colors" 
                      />
                      <div 
                        onMouseDown={(e) => handleResizeMouseDown(e, 'tr')}
                        className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-full cursor-nesw-resize z-50 hover:bg-indigo-600 transition-colors" 
                      />
                      <div 
                        onMouseDown={(e) => handleResizeMouseDown(e, 'bl')}
                        className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-full cursor-nesw-resize z-50 hover:bg-indigo-600 transition-colors" 
                      />
                      <div 
                        onMouseDown={(e) => handleResizeMouseDown(e, 'br')}
                        className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-full cursor-nwse-resize z-50 hover:bg-indigo-600 transition-colors" 
                      />

                      {/* Edges resize bars */}
                      <div 
                        onMouseDown={(e) => handleResizeMouseDown(e, 'r')}
                        className="absolute top-0 bottom-0 -right-1 w-2 cursor-ew-resize z-40" 
                      />
                      <div 
                        onMouseDown={(e) => handleResizeMouseDown(e, 'l')}
                        className="absolute top-0 bottom-0 -left-1 w-2 cursor-ew-resize z-40" 
                      />
                      <div 
                        onMouseDown={(e) => handleResizeMouseDown(e, 'b')}
                        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize z-40" 
                      />
                      <div 
                        onMouseDown={(e) => handleResizeMouseDown(e, 't')}
                        className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize z-40" 
                      />
                    </>
                  )}
                </div>
              );
            })}

            {/* REAL-TIME SNAPPING ALIGNMENT VISUAL GUIDES */}
            {snapGuides && (
              <>
                {snapGuides.x !== undefined && (
                  <div 
                    className="absolute top-0 bottom-0 border-l border-dashed border-indigo-500 z-50 pointer-events-none"
                    style={{ left: `${snapGuides.x}%` }}
                  ></div>
                )}
                {snapGuides.y !== undefined && (
                  <div 
                    className="absolute left-0 right-0 border-t border-dashed border-indigo-500 z-50 pointer-events-none"
                    style={{ top: `${snapGuides.y}%` }}
                  ></div>
                )}
              </>
            )}

          </div>
        </div>

        {/* 4. RIGHT SIDEBAR PROPERTIES INSPECTOR */}
        <div className="w-80 border-l border-slate-800 bg-slate-950 text-slate-300 flex flex-col overflow-y-auto shrink-0 p-4 select-none">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Inspector</span>
            </h3>
            {selectedElement && (
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-900/50 uppercase">
                {selectedElement.type}
              </span>
            )}
          </div>

          {selectedElement ? (
            <div className="space-y-4">
              
              {/* Layer Actions (Duplicate, Lock, Delete) */}
              <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800 gap-1.5">
                <button
                  onClick={() => handleUpdateElementProperty(selectedElement.id, 'locked', !selectedElement.locked)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                    selectedElement.locked ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300"
                  }`}
                  title={selectedElement.locked ? "Unlock element layout" : "Lock element layout"}
                >
                  {selectedElement.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{selectedElement.locked ? "Locked" : "Lock"}</span>
                </button>

                <button
                  onClick={() => handleDuplicateElement(selectedElement)}
                  className="p-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg text-xs"
                  title="Duplicate Element"
                >
                  <CopyPlus className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDeleteElement(selectedElement.id)}
                  className="p-2 bg-rose-950/20 border border-rose-900/40 hover:bg-rose-900 text-rose-300 hover:text-white rounded-lg text-xs"
                  title="Remove Element"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Position alignment tools */}
              {!selectedElement.locked && (
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Align to Canvas</label>
                  <div className="grid grid-cols-6 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                    <button onClick={() => alignElement('left')} className="p-1 hover:bg-slate-800 rounded text-center text-[9px]" title="Align Left">Left</button>
                    <button onClick={() => alignElement('center')} className="p-1 hover:bg-slate-800 rounded text-center text-[9px]" title="Align Horizontal Center">Center</button>
                    <button onClick={() => alignElement('right')} className="p-1 hover:bg-slate-800 rounded text-center text-[9px]" title="Align Right">Right</button>
                    <button onClick={() => alignElement('top')} className="p-1 hover:bg-slate-800 rounded text-center text-[9px]" title="Align Top">Top</button>
                    <button onClick={() => alignElement('middle')} className="p-1 hover:bg-slate-800 rounded text-center text-[9px]" title="Align Vertical Middle">Middle</button>
                    <button onClick={() => alignElement('bottom')} className="p-1 hover:bg-slate-800 rounded text-center text-[9px]" title="Align Bottom">Bottom</button>
                  </div>
                </div>
              )}

              {/* Property: Text modification content */}
              {(selectedElement.type === "text" || selectedElement.type === "badge") && (
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Text Content</label>
                  <textarea
                    id="property-text-content"
                    rows={3}
                    disabled={selectedElement.locked}
                    value={selectedElement.text || ""}
                    onChange={(e) => handleUpdateElementProperty(selectedElement.id, "text", e.target.value)}
                    onBlur={handleUpdatePropertyFinished}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs text-slate-200 focus:outline-none resize-none disabled:opacity-40"
                    placeholder="Enter customized text..."
                  />
                </div>
              )}

              {/* Property: Transparency / Opacity */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Transparency</label>
                  <span className="text-[10px] font-mono text-slate-400">{selectedElement.opacity ?? 100}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  disabled={selectedElement.locked}
                  value={selectedElement.opacity ?? 100}
                  onChange={(e) => handleUpdateElementProperty(selectedElement.id, "opacity", parseInt(e.target.value))}
                  onMouseUp={handleUpdatePropertyFinished}
                  className="w-full accent-indigo-600 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                />
              </div>

              {/* Property: Rotation (Manual tweak) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Rotation Angle</label>
                  <span className="text-[10px] font-mono text-slate-400">{selectedElement.rotate || 0}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  disabled={selectedElement.locked}
                  value={selectedElement.rotate || 0}
                  onChange={(e) => handleUpdateElementProperty(selectedElement.id, "rotate", parseInt(e.target.value))}
                  onMouseUp={handleUpdatePropertyFinished}
                  className="w-full accent-indigo-600 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                />
              </div>

              {/* Property: Image Specifics (Crop/Zoom slider, Border radius) */}
              {selectedElement.type === 'image' && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                    <h5 className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Image Frame Crop</h5>
                    
                    {/* Crop Factor (stored in lineHeight) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-slate-400 font-medium">Zoom Crop</span>
                        <span className="text-[10px] font-mono text-slate-400">{Math.round((selectedElement.lineHeight || 1.0) * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.05"
                        disabled={selectedElement.locked}
                        value={selectedElement.lineHeight || 1.0}
                        onChange={(e) => handleUpdateElementProperty(selectedElement.id, "lineHeight", parseFloat(e.target.value))}
                        onMouseUp={handleUpdatePropertyFinished}
                        className="w-full accent-indigo-600 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Crop offset X (stored in cropX) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-slate-400 font-medium">Offset horizontal</span>
                        <span className="text-[10px] font-mono text-slate-400">{selectedElement.cropX || 0}%</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        disabled={selectedElement.locked}
                        value={selectedElement.cropX || 0}
                        onChange={(e) => handleUpdateElementProperty(selectedElement.id, "cropX", parseInt(e.target.value))}
                        onMouseUp={handleUpdatePropertyFinished}
                        className="w-full accent-indigo-600 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Crop offset Y (stored in cropY) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-slate-400 font-medium">Offset vertical</span>
                        <span className="text-[10px] font-mono text-slate-400">{selectedElement.cropY || 0}%</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        disabled={selectedElement.locked}
                        value={selectedElement.cropY || 0}
                        onChange={(e) => handleUpdateElementProperty(selectedElement.id, "cropY", parseInt(e.target.value))}
                        onMouseUp={handleUpdatePropertyFinished}
                        className="w-full accent-indigo-600 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Corner Radius */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Border Style</label>
                    <select
                      value={selectedElement.borderRadius || "lg"}
                      onChange={(e) => {
                        handleUpdateElementProperty(selectedElement.id, "borderRadius", e.target.value);
                        pushHistory(elements, backgroundColor, backgroundGradient, backgroundImage);
                      }}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                    >
                      <option value="none">Square corners</option>
                      <option value="lg">Soft rounded (lg)</option>
                      <option value="full">Perfect Circle</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Property: Font Family / Size / Styling Controls */}
              {selectedElement.type === "text" && (
                <div className="space-y-4">
                  {/* Font picker */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Font Style</label>
                    <select
                      value={selectedElement.fontFamily || "sans"}
                      disabled={selectedElement.locked}
                      onChange={(e) => {
                        handleUpdateElementProperty(selectedElement.id, "fontFamily", e.target.value as any);
                        pushHistory(elements, backgroundColor, backgroundGradient, backgroundImage);
                      }}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-40"
                    >
                      <option value="sans">Inter (Modern Clean)</option>
                      <option value="display">Space Grotesk (Tech Display)</option>
                      <option value="mono">JetBrains Mono (Technical)</option>
                      <option value="serif">Playfair Display (Elegant Serif)</option>
                    </select>
                  </div>

                  {/* Size slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Font Size</label>
                      <span className="text-[10px] font-mono text-slate-400">{selectedElement.fontSize || 16}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="72"
                      disabled={selectedElement.locked}
                      value={selectedElement.fontSize || 16}
                      onChange={(e) => handleUpdateElementProperty(selectedElement.id, "fontSize", parseInt(e.target.value))}
                      onMouseUp={handleUpdatePropertyFinished}
                      className="w-full accent-indigo-600 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                    />
                  </div>

                  {/* Formatting Toggles (Bold, Italic, Underline) */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Formatting</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => {
                          handleUpdateElementProperty(selectedElement.id, "fontWeight", selectedElement.fontWeight === "bold" ? "normal" : "bold");
                          pushHistory(elements, backgroundColor, backgroundGradient, backgroundImage);
                        }}
                        disabled={selectedElement.locked}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          selectedElement.fontWeight === "bold" ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        B
                      </button>
                      <button
                        onClick={() => {
                          handleUpdateElementProperty(selectedElement.id, "italic", !selectedElement.italic);
                          pushHistory(elements, backgroundColor, backgroundGradient, backgroundImage);
                        }}
                        disabled={selectedElement.locked}
                        className={`py-1.5 rounded-lg text-xs italic border transition-all ${
                          selectedElement.italic ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        I
                      </button>
                      <button
                        onClick={() => {
                          handleUpdateElementProperty(selectedElement.id, "underline", !selectedElement.underline);
                          pushHistory(elements, backgroundColor, backgroundGradient, backgroundImage);
                        }}
                        disabled={selectedElement.locked}
                        className={`py-1.5 rounded-lg text-xs underline border transition-all ${
                          selectedElement.underline ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        U
                      </button>
                    </div>
                  </div>

                  {/* Alignments button grid */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Text Align</label>
                    <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                      <button
                        onClick={() => {
                          handleUpdateElementProperty(selectedElement.id, "align", "left");
                          pushHistory(elements, backgroundColor, backgroundGradient, backgroundImage);
                        }}
                        className={`py-1 flex items-center justify-center rounded ${selectedElement.align === 'left' ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          handleUpdateElementProperty(selectedElement.id, "align", "center");
                          pushHistory(elements, backgroundColor, backgroundGradient, backgroundImage);
                        }}
                        className={`py-1 flex items-center justify-center rounded ${selectedElement.align === 'center' || !selectedElement.align ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          handleUpdateElementProperty(selectedElement.id, "align", "right");
                          pushHistory(elements, backgroundColor, backgroundGradient, backgroundImage);
                        }}
                        className={`py-1 flex items-center justify-center rounded ${selectedElement.align === 'right' ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          handleUpdateElementProperty(selectedElement.id, "align", "justify");
                          pushHistory(elements, backgroundColor, backgroundGradient, backgroundImage);
                        }}
                        className={`py-1 flex items-center justify-center rounded ${selectedElement.align === 'justify' ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                      >
                        <AlignJustify className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Text letter-spacing and line height multipliers */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                    <h5 className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Text Spacing Options</h5>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-slate-400 font-medium">Letter Spacing</span>
                        <span className="text-[10px] font-mono text-slate-400">{selectedElement.letterSpacing || 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="-2"
                        max="16"
                        disabled={selectedElement.locked}
                        value={selectedElement.letterSpacing || 0}
                        onChange={(e) => handleUpdateElementProperty(selectedElement.id, "letterSpacing", parseInt(e.target.value))}
                        onMouseUp={handleUpdatePropertyFinished}
                        className="w-full accent-indigo-600 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-slate-400 font-medium">Line Height</span>
                        <span className="text-[10px] font-mono text-slate-400">{selectedElement.lineHeight || 1.2}</span>
                      </div>
                      <input
                        type="range"
                        min="0.8"
                        max="2.2"
                        step="0.1"
                        disabled={selectedElement.locked}
                        value={selectedElement.lineHeight || 1.2}
                        onChange={(e) => handleUpdateElementProperty(selectedElement.id, "lineHeight", parseFloat(e.target.value))}
                        onMouseUp={handleUpdatePropertyFinished}
                        className="w-full accent-indigo-600 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Color Picker font */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Text Color</label>
                    <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <input
                        type="color"
                        disabled={selectedElement.locked}
                        value={selectedElement.color || "#000000"}
                        onChange={(e) => handleUpdateElementProperty(selectedElement.id, "color", e.target.value)}
                        onBlur={handleUpdatePropertyFinished}
                        className="w-8 h-8 border border-slate-800 bg-transparent rounded-lg cursor-pointer disabled:opacity-40"
                      />
                      <span className="text-xs font-mono text-slate-400">{selectedElement.color || "#000000"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Property: Shape / Icon Color options */}
              {(selectedElement.type === 'shape' || selectedElement.type === 'icon') && (
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Fill & Stroke Color</label>
                  <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <input
                      type="color"
                      disabled={selectedElement.locked}
                      value={selectedElement.type === 'shape' ? (selectedElement.backgroundColor || "#818CF8") : (selectedElement.color || "#4F46E5")}
                      onChange={(e) => {
                        if (selectedElement.type === 'shape') {
                          handleUpdateElementProperty(selectedElement.id, "backgroundColor", e.target.value);
                        } else {
                          handleUpdateElementProperty(selectedElement.id, "color", e.target.value);
                        }
                      }}
                      onBlur={handleUpdatePropertyFinished}
                      className="w-8 h-8 border border-slate-800 bg-transparent rounded-lg cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-400">
                      {selectedElement.type === 'shape' ? (selectedElement.backgroundColor || "#818CF8") : (selectedElement.color || "#4F46E5")}
                    </span>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="py-12 text-center text-slate-600 flex flex-col items-center gap-2">
              <HelpCircle className="w-8 h-8 opacity-40 text-slate-500" />
              <p className="text-xs font-semibold max-w-[80%] mx-auto leading-relaxed">
                No element is selected. Click on any block or shape on the Canvas stage to customize its attributes.
              </p>
            </div>
          )}

          {/* Quick Shortcuts Help Cards inside sidebar */}
          <div className="mt-auto pt-4 border-t border-slate-800">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-[10px] text-slate-500 space-y-1">
              <span className="font-semibold text-slate-300 block mb-1">⌨️ Canvas hotkeys</span>
              <div className="flex justify-between"><span>Delete Element</span> <kbd className="font-mono bg-slate-950 px-1 rounded">Del</kbd></div>
              <div className="flex justify-between"><span>Duplicate</span> <kbd className="font-mono bg-slate-950 px-1 rounded">Ctrl+D</kbd></div>
              <div className="flex justify-between"><span>Undo Action</span> <kbd className="font-mono bg-slate-950 px-1 rounded">Ctrl+Z</kbd></div>
              <div className="flex justify-between"><span>Redo Action</span> <kbd className="font-mono bg-slate-950 px-1 rounded">Ctrl+Y</kbd></div>
              <div className="flex justify-between"><span>Nudge Layer</span> <kbd className="font-mono bg-slate-950 px-1 rounded">Arrows</kbd></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
