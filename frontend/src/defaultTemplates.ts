import { Template } from "./types";

export const DEFAULT_TEMPLATES: Template[] = [
  // ==========================================
  // WEDDINGS (5 Free, 5 Paid)
  // ==========================================
  {
    id: "wedding-free-1",
    title: "Classic White Wedding",
    category: "wedding",
    tier: "free",
    description: "Sleek white invitation featuring traditional layout and clean typography alignments.",
    backgroundColor: "#FFFFFF",
    width: 600,
    height: 800,
    elements: [
      { id: "wf1-crown", type: "sticker", stickerUrl: "sticker-gold-crown", x: 45, y: 10, width: 10, height: 10 },
      { id: "wf1-1", type: "text", text: "THE WEDDING OF", fontSize: 13, fontFamily: "sans", fontWeight: "semibold", color: "#64748B", x: 10, y: 22, width: 80, align: "center" },
      { id: "wf1-2", type: "text", text: "Thomas & Sarah", fontSize: 34, fontFamily: "serif", fontWeight: "bold", color: "#0F172A", x: 10, y: 29, width: 80, align: "center" },
      { id: "wf1-line", type: "shape", shapeType: "line", backgroundColor: "#D97706", x: 35, y: 41, width: 30, height: 0.5 },
      { id: "wf1-3", type: "text", text: "JOIN US IN CELEBRATION", fontSize: 12, fontFamily: "sans", fontWeight: "medium", color: "#64748B", x: 10, y: 46, width: 80, align: "center" },
      { id: "wf1-4", type: "text", text: "September 18, 2026", fontSize: 18, fontFamily: "display", fontWeight: "bold", color: "#1E293B", x: 10, y: 53, width: 80, align: "center" },
      { id: "wf1-5", type: "text", text: "The Grand Pavilion, New York", fontSize: 14, fontFamily: "sans", fontWeight: "normal", color: "#475569", x: 10, y: 62, width: 80, align: "center" },
      { id: "wf1-6", type: "badge", text: "RSVP BY AUGUST 1ST", fontSize: 11, fontFamily: "mono", fontWeight: "bold", color: "#475569", backgroundColor: "#F1F5F9", x: 25, y: 72, width: 50, align: "center", borderRadius: "md" }
    ]
  },
  {
    id: "wedding-free-2",
    title: "Elegant Rose Wedding",
    category: "wedding",
    tier: "free",
    description: "A lovely invite with soft pink hues and classic layout flow.",
    backgroundColor: "#FAF5F5",
    width: 600,
    height: 800,
    elements: [
      { id: "wf2-heart", type: "sticker", stickerUrl: "sticker-rustic-heart", x: 44, y: 8, width: 12, height: 12 },
      { id: "wf2-1", type: "badge", text: "SAVE THE DATE", fontSize: 11, fontFamily: "mono", fontWeight: "bold", color: "#B45309", backgroundColor: "#FEF3C7", x: 30, y: 21, width: 40, align: "center", borderRadius: "full" },
      { id: "wf2-2", type: "text", text: "Charlotte & Oliver", fontSize: 32, fontFamily: "serif", fontWeight: "bold", color: "#881337", x: 10, y: 30, width: 80, align: "center" },
      { id: "wf2-3", type: "text", text: "Together with their families, invite you to share in their joy.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#4C0519", x: 15, y: 44, width: 70, align: "center" },
      { id: "wf2-4", type: "text", text: "DECEMBER 05, 2026", fontSize: 18, fontFamily: "display", fontWeight: "semibold", color: "#881337", x: 10, y: 55, width: 80, align: "center" },
      { id: "wf2-wreath", type: "sticker", stickerUrl: "sticker-vintage-wreath", x: 44, y: 65, width: 12, height: 12 }
    ]
  },
  {
    id: "wedding-free-3",
    title: "Lavender Love Invitation",
    category: "wedding",
    tier: "free",
    description: "Serene violet invite layout centering modern clean font pairing.",
    backgroundColor: "#FBF9FF",
    width: 600,
    height: 800,
    elements: [
      { id: "wf3-spark", type: "sticker", stickerUrl: "sticker-sparkles-gold", x: 44, y: 8, width: 12, height: 12 },
      { id: "wf3-1", type: "text", text: "WE ARE GETTING MARRIED", fontSize: 12, fontFamily: "mono", fontWeight: "bold", color: "#6B21A8", x: 10, y: 22, width: 80, align: "center" },
      { id: "wf3-2", type: "text", text: "Amelia & Arthur", fontSize: 36, fontFamily: "serif", fontWeight: "bold", color: "#581C87", x: 10, y: 30, width: 80, align: "center" },
      { id: "wf3-line", type: "shape", shapeType: "line", backgroundColor: "#D8B4FE", x: 25, y: 42, width: 50, height: 1 },
      { id: "wf3-3", type: "text", text: "Celebrate our beautiful union in the lavender fields.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#6B21A8", x: 10, y: 46, width: 80, align: "center" },
      { id: "wf3-4", type: "text", text: "06 . 24 . 2026 | 4:00 PM", fontSize: 16, fontFamily: "display", fontWeight: "bold", color: "#3B0764", x: 10, y: 56, width: 80, align: "center" },
      { id: "wf3-5", type: "badge", text: "lavenderfields.wedding", fontSize: 11, fontFamily: "sans", fontWeight: "medium", color: "#FFFFFF", backgroundColor: "#7E22CE", x: 25, y: 68, width: 50, align: "center", borderRadius: "full" }
    ]
  },
  {
    id: "wedding-free-4",
    title: "Autumn Leaves Invitation",
    category: "wedding",
    tier: "free",
    description: "Warm color scheme for cozy fall weddings.",
    backgroundColor: "#FFFBF0",
    width: 600,
    height: 800,
    elements: [
      { id: "wf4-heart", type: "icon", iconName: "Heart", color: "#C2410C", x: 47, y: 10, width: 6, height: 6 },
      { id: "wf4-1", type: "text", text: "CELEBRATE AUTUMN WITH US", fontSize: 12, fontFamily: "sans", fontWeight: "bold", color: "#C2410C", x: 10, y: 18, width: 80, align: "center" },
      { id: "wf4-2", type: "text", text: "Liam & Evelyn", fontSize: 35, fontFamily: "serif", fontWeight: "bold", color: "#7C2D12", x: 10, y: 26, width: 80, align: "center" },
      { id: "wf4-line", type: "shape", shapeType: "line", backgroundColor: "#EA580C", x: 20, y: 40, width: 60, height: 1 },
      { id: "wf4-3", type: "text", text: "For a golden evening under the falling leaves", fontSize: 14, fontFamily: "sans", fontWeight: "medium", color: "#9A3412", x: 10, y: 44, width: 80, align: "center" },
      { id: "wf4-4", type: "text", text: "NOVEMBER 14, 2026", fontSize: 18, fontFamily: "display", fontWeight: "bold", color: "#431407", x: 10, y: 54, width: 80, align: "center" },
      { id: "wf4-5", type: "text", text: "The Rustic Barn, Vermont", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#7C2D12", x: 10, y: 64, width: 80, align: "center" }
    ]
  },
  {
    id: "wedding-free-5",
    title: "Modern Eucalyptus Invitation",
    category: "wedding",
    tier: "free",
    description: "Earthy mint green palette with elegant modern layouts.",
    backgroundColor: "#F2F6F3",
    width: 600,
    height: 800,
    elements: [
      { id: "wf5-wreath", type: "sticker", stickerUrl: "sticker-vintage-wreath", x: 44, y: 10, width: 12, height: 12 },
      { id: "wf5-1", type: "text", text: "TOGETHER WITH OUR PARENTS", fontSize: 11, fontFamily: "mono", fontWeight: "normal", color: "#166534", x: 10, y: 24, width: 80, align: "center" },
      { id: "wf5-2", type: "text", text: "Lucas & Sophia", fontSize: 34, fontFamily: "sans", fontWeight: "bold", color: "#14532D", x: 10, y: 31, width: 80, align: "center" },
      { id: "wf5-3", type: "text", text: "Join us as we vow an eternal bond", fontSize: 13, fontFamily: "serif", fontWeight: "normal", color: "#15803D", x: 10, y: 46, width: 80, align: "center" },
      { id: "wf5-4", type: "text", text: "AUGUST 08, 2026 AT 6 PM", fontSize: 16, fontFamily: "display", fontWeight: "bold", color: "#14532D", x: 10, y: 56, width: 80, align: "center" },
      { id: "wf5-pin", type: "icon", iconName: "MapPin", color: "#166534", x: 48, y: 68, width: 4, height: 4 }
    ]
  },
  {
    id: "wedding-paid-1",
    title: "Royal Golden Wedding",
    category: "wedding",
    tier: "paid",
    description: "Majestic obsidian black and gold template with deep luxury serif typography.",
    backgroundColor: "#0B0F19",
    width: 600,
    height: 800,
    elements: [
      { id: "wp1-crown", type: "sticker", stickerUrl: "sticker-gold-crown", x: 43, y: 10, width: 14, height: 14 },
      { id: "wp1-badge", type: "badge", text: "⚜️ ROYAL MATRIMONY ⚜️", fontSize: 11, fontFamily: "mono", fontWeight: "bold", color: "#FBBF24", backgroundColor: "#111827", x: 20, y: 26, width: 60, align: "center", borderRadius: "full" },
      { id: "wp1-2", type: "text", text: "Aarav & Meera", fontSize: 40, fontFamily: "serif", fontWeight: "bold", color: "#F59E0B", x: 10, y: 34, width: 80, align: "center" },
      { id: "wp1-line", type: "shape", shapeType: "line", backgroundColor: "#D97706", x: 25, y: 47, width: 50, height: 1 },
      { id: "wp1-3", type: "text", text: "REQUEST THE HONOR OF YOUR PRESENCE", fontSize: 11, fontFamily: "sans", fontWeight: "semibold", color: "#94A3B8", x: 10, y: 52, width: 80, align: "center" },
      { id: "wp1-4", type: "text", text: "OCTOBER 24, 2026", fontSize: 22, fontFamily: "display", fontWeight: "bold", color: "#F59E0B", x: 10, y: 60, width: 80, align: "center" },
      { id: "wp1-star", type: "icon", iconName: "Star", color: "#F59E0B", x: 48, y: 72, width: 5, height: 5 }
    ]
  },
  {
    id: "wedding-paid-2",
    title: "Midnight Starry Celestial",
    category: "wedding",
    tier: "paid",
    description: "An elegant cosmic template styling rich dark blue gradients and magical gold fonts.",
    backgroundColor: "#020617",
    backgroundGradient: "linear-gradient(135deg, #020617 0%, #1E1B4B 50%, #311042 100%)",
    width: 600,
    height: 800,
    elements: [
      { id: "wp2-spark", type: "sticker", stickerUrl: "sticker-sparkles-gold", x: 44, y: 10, width: 12, height: 12 },
      { id: "wp2-1", type: "text", text: "WRITTEN IN THE STARS", fontSize: 11, fontFamily: "mono", fontWeight: "bold", color: "#C084FC", x: 10, y: 24, width: 80, align: "center" },
      { id: "wp2-2", type: "text", text: "Celeste & Orion", fontSize: 38, fontFamily: "serif", fontWeight: "bold", color: "#F3E8FF", x: 10, y: 31, width: 80, align: "center" },
      { id: "wp2-line", type: "shape", shapeType: "line", backgroundColor: "#A78BFA", x: 30, y: 45, width: 40, height: 1 },
      { id: "wp2-3", type: "text", text: "Inviting you to celebrate their cosmic love story", fontSize: 13, fontFamily: "sans", fontWeight: "medium", color: "#A78BFA", x: 10, y: 49, width: 80, align: "center" },
      { id: "wp2-4", type: "text", text: "SEPTEMBER 12, 2026 AT DUSK", fontSize: 18, fontFamily: "display", fontWeight: "bold", color: "#F3E8FF", x: 10, y: 58, width: 80, align: "center" },
      { id: "wp2-code", type: "badge", text: "✨ DRESS CODE: COSMIC DUSK ✨", fontSize: 10, fontFamily: "sans", fontWeight: "bold", color: "#FFFFFF", backgroundColor: "#4C1D95", x: 15, y: 70, width: 70, align: "center", borderRadius: "md" }
    ]
  },
  {
    id: "wedding-paid-3",
    title: "Emerald Forest Luxury",
    category: "wedding",
    tier: "paid",
    description: "Deep lush emerald green backdrop with sophisticated gold-ivory serif headers.",
    backgroundColor: "#022C22",
    width: 600,
    height: 800,
    elements: [
      { id: "wp3-wreath", type: "sticker", stickerUrl: "sticker-vintage-wreath", x: 41, y: 10, width: 18, height: 18 },
      { id: "wp3-1", type: "text", text: "WITH LOVE AND JOY", fontSize: 12, fontFamily: "mono", fontWeight: "semibold", color: "#34D399", x: 10, y: 30, width: 80, align: "center" },
      { id: "wp3-2", type: "text", text: "Gavin & Vivienne", fontSize: 36, fontFamily: "serif", fontWeight: "bold", color: "#ECFDF5", x: 10, y: 38, width: 80, align: "center" },
      { id: "wp3-heart", type: "icon", iconName: "Heart", color: "#34D399", x: 48, y: 50, width: 5, height: 5 },
      { id: "wp3-3", type: "text", text: "invite you to their evergreen wedding ceremony", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#A7F3D0", x: 10, y: 56, width: 80, align: "center" },
      { id: "wp3-4", type: "text", text: "OCTOBER 10, 2026 | 3:00 PM", fontSize: 18, fontFamily: "display", fontWeight: "bold", color: "#34D399", x: 10, y: 64, width: 80, align: "center" }
    ]
  },
  {
    id: "wedding-paid-4",
    title: "Sunset Peach Watercolor",
    category: "wedding",
    tier: "paid",
    description: "Stunning warm sunset pink with minimalist typographic contrast.",
    backgroundColor: "#FFF1F2",
    backgroundGradient: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 40%, #FFEDD5 100%)",
    width: 600,
    height: 800,
    elements: [
      { id: "wp4-heart", type: "sticker", stickerUrl: "sticker-rustic-heart", x: 43, y: 12, width: 14, height: 14 },
      { id: "wp4-1", type: "text", text: "SAVE OUR DATE", fontSize: 13, fontFamily: "sans", fontWeight: "bold", color: "#BE123C", x: 10, y: 28, width: 80, align: "center" },
      { id: "wp4-2", type: "text", text: "Maya & Julian", fontSize: 42, fontFamily: "serif", fontWeight: "bold", color: "#4C0519", x: 10, y: 36, width: 80, align: "center" },
      { id: "wp4-line", type: "shape", shapeType: "line", backgroundColor: "#FDA4AF", x: 25, y: 50, width: 50, height: 1 },
      { id: "wp4-3", type: "text", text: "A summer wedding under peach blossoms", fontSize: 13, fontFamily: "mono", fontWeight: "medium", color: "#9F1239", x: 10, y: 54, width: 80, align: "center" },
      { id: "wp4-4", type: "text", text: "JUNE 20, 2026 | SEASIDE CLIFFS", fontSize: 16, fontFamily: "display", fontWeight: "bold", color: "#E11D48", x: 10, y: 64, width: 80, align: "center" }
    ]
  },
  {
    id: "wedding-paid-5",
    title: "Art Deco Luxury",
    category: "wedding",
    tier: "paid",
    description: "Premium stone-black background with luxury art-deco gold styled borders.",
    backgroundColor: "#1C1917",
    width: 600,
    height: 800,
    elements: [
      { id: "wp5-crown", type: "sticker", stickerUrl: "sticker-gold-crown", x: 45, y: 4, width: 10, height: 10 },
      { id: "wp5-banner", type: "sticker", stickerUrl: "sticker-retro-banner", x: 30, y: 14, width: 40, height: 12 },
      { id: "wp5-2", type: "text", text: "Alexander & Diana", fontSize: 36, fontFamily: "serif", fontWeight: "bold", color: "#FBBF24", x: 10, y: 28, width: 80, align: "center" },
      { id: "wp5-line", type: "shape", shapeType: "line", backgroundColor: "#D97706", x: 20, y: 42, width: 60, height: 1 },
      { id: "wp5-3", type: "text", text: "SOCIETY MARRY CELEBRATION", fontSize: 11, fontFamily: "sans", fontWeight: "bold", color: "#D6D3D1", x: 10, y: 46, width: 80, align: "center" },
      { id: "wp5-4", type: "text", text: "DECEMBER 31, 2026", fontSize: 20, fontFamily: "display", fontWeight: "bold", color: "#FBBF24", x: 10, y: 56, width: 80, align: "center" },
      { id: "wp5-5", type: "text", text: "MIDNIGHT SPEAKEASY PALACE, NY", fontSize: 13, fontFamily: "serif", fontWeight: "semibold", color: "#FFFFFF", x: 10, y: 66, width: 80, align: "center" }
    ]
  },

  // ==========================================
  // DOCUMENTS (5 Free, 5 Paid)
  // ==========================================
  {
    id: "doc-free-1",
    title: "Basic Corporate Letterhead",
    category: "document",
    tier: "free",
    description: "Clean simple corporate letterhead with standard formatting grid.",
    backgroundColor: "#FFFFFF",
    width: 600,
    height: 800,
    elements: [
      { id: "df1-topbar", type: "shape", shapeType: "rectangle", backgroundColor: "#1E3A8A", x: 0, y: 0, width: 100, height: 2 },
      { id: "df1-brand", type: "badge", text: "🏢 ACME GLOBAL", fontSize: 12, fontFamily: "sans", fontWeight: "bold", color: "#1E3A8A", backgroundColor: "#DBEAFE", x: 8, y: 6, width: 35, align: "center", borderRadius: "md" },
      { id: "df1-sep", type: "shape", shapeType: "line", backgroundColor: "#E2E8F0", x: 8, y: 16, width: 84, height: 1 },
      { id: "df1-2", type: "text", text: "TO WHOM IT MAY CONCERN,", fontSize: 14, fontFamily: "display", fontWeight: "bold", color: "#1E293B", x: 8, y: 22, width: 84, align: "left" },
      { id: "df1-3", type: "text", text: "This document serves as an official confirmation of business partnership between Acme Industries and our allied vendors. All terms outlined herein shall be binding and subject to standard local trade regulations.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#475569", x: 8, y: 32, width: 84, align: "left" },
      { id: "df1-4", type: "text", text: "Please review the agreements carefully and sign the attached duplicate copy.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#475569", x: 8, y: 50, width: 84, align: "left" },
      { id: "df1-sigline", type: "shape", shapeType: "line", backgroundColor: "#94A3B8", x: 8, y: 70, width: 25, height: 1 },
      { id: "df1-5", type: "text", text: "Sincerely,\nExecutive Board Office", fontSize: 13, fontFamily: "serif", fontWeight: "semibold", color: "#0F172A", x: 8, y: 72, width: 40, align: "left" }
    ]
  },
  {
    id: "doc-free-2",
    title: "Standard Invoice Template",
    category: "document",
    tier: "free",
    description: "Elegantly aligned standard invoicing system with a visual sidebar.",
    backgroundColor: "#F8FAFC",
    width: 600,
    height: 800,
    elements: [
      { id: "df2-sidebar", type: "shape", shapeType: "rectangle", backgroundColor: "#0F172A", x: 0, y: 0, width: 4, height: 100 },
      { id: "df2-1", type: "text", text: "INVOICE", fontSize: 24, fontFamily: "display", fontWeight: "bold", color: "#0F172A", x: 8, y: 8, width: 40, align: "left" },
      { id: "df2-2", type: "text", text: "Invoice No: #INV-2026-09\nDate: July 05, 2026", fontSize: 11, fontFamily: "mono", fontWeight: "semibold", color: "#64748B", x: 50, y: 8, width: 42, align: "right" },
      { id: "df2-3", type: "text", text: "BILL TO:\nClient Corp LLC\n123 Business Rd", fontSize: 12, fontFamily: "sans", fontWeight: "medium", color: "#334155", x: 8, y: 22, width: 40, align: "left" },
      { id: "df2-sep1", type: "shape", shapeType: "line", backgroundColor: "#CBD5E1", x: 8, y: 35, width: 84, height: 1 },
      { id: "df2-4", type: "text", text: "SERVICES RENDERED:\n- Web Layout Styling: $1,500.00\n- Fullstack Server Setup: $2,500.00\n- AI Generation Consulting: $1,000.00", fontSize: 12, fontFamily: "mono", fontWeight: "normal", color: "#475569", x: 8, y: 38, width: 84, align: "left" },
      { id: "df2-5", type: "badge", text: "TOTAL AMOUNT DUE: $5,000.00", fontSize: 13, fontFamily: "sans", fontWeight: "bold", color: "#FFFFFF", backgroundColor: "#0F172A", x: 8, y: 64, width: 84, align: "center", borderRadius: "md" }
    ]
  },
  {
    id: "doc-free-3",
    title: "Meeting Agenda Worksheet",
    category: "document",
    tier: "free",
    description: "Simple minimalist schedule framework for executive board briefings.",
    backgroundColor: "#FAFAF9",
    width: 600,
    height: 800,
    elements: [
      { id: "df3-border", type: "shape", shapeType: "line", backgroundColor: "#78716C", x: 20, y: 6, width: 60, height: 1 },
      { id: "df3-1", type: "text", text: "WEEKLY SYNC AGENDA", fontSize: 18, fontFamily: "display", fontWeight: "bold", color: "#44403C", x: 8, y: 10, width: 84, align: "center" },
      { id: "df3-award", type: "icon", iconName: "Award", color: "#D97706", x: 48, y: 17, width: 4, height: 4 },
      { id: "df3-2", type: "text", text: "Time: 10:00 AM | Chairperson: Dr. Robert", fontSize: 11, fontFamily: "mono", fontWeight: "medium", color: "#78716C", x: 8, y: 22, width: 84, align: "center" },
      { id: "df3-3", type: "text", text: "1. 10:00 - 10:15 | Welcome Remarks\n2. 10:15 - 10:45 | Q2 Financial Review\n3. 10:45 - 11:15 | Product Launch Roadmap\n4. 11:15 - 11:30 | Open Floor Discussion", fontSize: 13, fontFamily: "sans", fontWeight: "medium", color: "#44403C", x: 12, y: 32, width: 76, align: "left" },
      { id: "df3-4", type: "text", text: "Action Items:\n- Revise sales slides\n- Assign developer resources\n- Validate API gateway tests", fontSize: 12, fontFamily: "sans", fontWeight: "normal", color: "#57534E", x: 12, y: 55, width: 76, align: "left" }
    ]
  },
  {
    id: "doc-free-4",
    title: "Simple Project Report",
    category: "document",
    tier: "free",
    description: "Modern straightforward document framework for student or work reports.",
    backgroundColor: "#FFFFFF",
    width: 600,
    height: 800,
    elements: [
      { id: "df4-accent", type: "shape", shapeType: "rectangle", backgroundColor: "#0284C7", x: 0, y: 0, width: 4, height: 100 },
      { id: "df4-1", type: "text", text: "PROJECT RESEARCH DISCOVERY", fontSize: 20, fontFamily: "display", fontWeight: "bold", color: "#0369A1", x: 8, y: 10, width: 84, align: "left" },
      { id: "df4-sep", type: "shape", shapeType: "line", backgroundColor: "#E2E8F0", x: 8, y: 18, width: 84, height: 1 },
      { id: "df4-2", type: "text", text: "Author: Dev Team Alpha | Version: 1.0.4", fontSize: 11, fontFamily: "mono", fontWeight: "semibold", color: "#0284C7", x: 8, y: 22, width: 84, align: "left" },
      { id: "df4-3", type: "text", text: "This report analyzes the usability of modular full-stack frameworks. Through rapid API integration, we achieved a significant 40% reduction in database cold startup delays. Tests run perfectly under heavy container simulation.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#334155", x: 8, y: 32, width: 84, align: "left" }
    ]
  },
  {
    id: "doc-free-5",
    title: "Weekly Planner Template",
    category: "document",
    tier: "free",
    description: "Cozy warm planner layout to track routines and meetings.",
    backgroundColor: "#FAF5F0",
    width: 600,
    height: 800,
    elements: [
      { id: "df5-banner", type: "sticker", stickerUrl: "sticker-retro-banner", x: 30, y: 4, width: 40, height: 10 },
      { id: "df5-1", type: "text", text: "MY WEEKLY PRIORITIES", fontSize: 18, fontFamily: "display", fontWeight: "bold", color: "#9A3412", x: 10, y: 16, width: 80, align: "center" },
      { id: "df5-1-line", type: "shape", shapeType: "line", backgroundColor: "#9A3412", x: 20, y: 23, width: 60, height: 1 },
      { id: "df5-2", type: "text", text: "• Monday: Database backup and script verification\n• Tuesday: Code sprint review & testing\n• Wednesday: Client alignment presentation\n• Thursday: Refactor CSS modules & clean imports\n• Friday: Production pipeline deployment", fontSize: 13, fontFamily: "sans", fontWeight: "medium", color: "#C2410C", x: 12, y: 28, width: 76, align: "left" }
    ]
  },
  {
    id: "doc-paid-1",
    title: "Sleek Project Proposal",
    category: "document",
    tier: "paid",
    description: "Deep elegant charcoal proposal layout designed for elite executive business teams.",
    backgroundColor: "#0F172A",
    width: 600,
    height: 800,
    elements: [
      { id: "dp1-topline", type: "shape", shapeType: "rectangle", backgroundColor: "#38BDF8", x: 0, y: 0, width: 100, height: 3 },
      { id: "dp1-1", type: "badge", text: "CONFIDENTIAL PROPOSAL 2026", fontSize: 11, fontFamily: "mono", fontWeight: "bold", color: "#38BDF8", backgroundColor: "#1E293B", x: 8, y: 8, width: 50, align: "left", borderRadius: "md" },
      { id: "dp1-2", type: "text", text: "Enterprise Solutions", fontSize: 34, fontFamily: "display", fontWeight: "bold", color: "#F8FAFC", x: 8, y: 16, width: 84, align: "left" },
      { id: "dp1-bgbox", type: "shape", shapeType: "rectangle", backgroundColor: "#1E293B", x: 6, y: 30, width: 88, height: 18, borderRadius: "lg" },
      { id: "dp1-3", type: "text", text: "A comprehensive strategic blueprint detailing modern load-balancing and direct container deployment architectures.", fontSize: 14, fontFamily: "sans", fontWeight: "normal", color: "#94A3B8", x: 10, y: 33, width: 80, align: "left" },
      { id: "dp1-4", type: "text", text: "1. STRATEGIC ARCHITECTURE", fontSize: 16, fontFamily: "display", fontWeight: "bold", color: "#38BDF8", x: 8, y: 52, width: 84, align: "left" },
      { id: "dp1-5", type: "text", text: "Deploying high-frequency, auto-scaling databases with redundant active clustering guarantees optimal throughput. Our strategy maintains 99.999% system availability even under peak global workload simulations.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#CBD5E1", x: 8, y: 60, width: 84, align: "left" }
    ]
  },
  {
    id: "doc-paid-2",
    title: "Creative Portfolio Resume",
    category: "document",
    tier: "paid",
    description: "Stunning minimalist modern CV featuring elegant ivory tone and exquisite serif accents.",
    backgroundColor: "#FAF6F0",
    width: 600,
    height: 800,
    elements: [
      { id: "dp2-sidebar", type: "shape", shapeType: "rectangle", backgroundColor: "#1C1917", x: 0, y: 0, width: 32, height: 100 },
      { id: "dp2-side-title", type: "text", text: "CONTACT\n\n✉️ info@vance.com\n📞 555-0199\n🌐 vance.design\n📍 New York, NY", fontSize: 11, fontFamily: "mono", color: "#F59E0B", x: 3, y: 12, width: 26, align: "left" },
      { id: "dp2-1", type: "text", text: "JULIAN VANCE", fontSize: 34, fontFamily: "serif", fontWeight: "bold", color: "#1C1917", x: 36, y: 10, width: 56, align: "left" },
      { id: "dp2-2", type: "text", text: "EXECUTIVE CREATIVE DIRECTOR", fontSize: 11, fontFamily: "mono", fontWeight: "bold", color: "#D97706", x: 36, y: 22, width: 56, align: "left" },
      { id: "dp2-div", type: "shape", shapeType: "line", backgroundColor: "#D97706", x: 36, y: 28, width: 56, height: 1 },
      { id: "dp2-3", type: "text", text: "12+ years directing visual systems and high-converting user interfaces. Expert in typography alignment, reactive canvas models, and branding.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#44403C", x: 36, y: 32, width: 56, align: "left" },
      { id: "dp2-4", type: "text", text: "SELECTED EXPERIENCE\n• Principal Designer, Orbit Studio (2022-Pres)\n• Senior Art Director, TechGen Corp (2018-2022)", fontSize: 13, fontFamily: "serif", fontWeight: "semibold", color: "#1C1917", x: 36, y: 54, width: 56, align: "left" }
    ]
  },
  {
    id: "doc-paid-3",
    title: "Tech Startup Pitch Cover",
    category: "document",
    tier: "paid",
    description: "Highly energetic neon accents over elegant black, perfect for funding presentations.",
    backgroundColor: "#030712",
    backgroundGradient: "linear-gradient(135deg, #030712 0%, #0B1530 50%, #1E1B4B 100%)",
    width: 600,
    height: 800,
    elements: [
      { id: "dp3-bar", type: "shape", shapeType: "rectangle", backgroundColor: "#10B981", x: 0, y: 0, width: 100, height: 4 },
      { id: "dp3-sparkle", type: "sticker", stickerUrl: "sticker-sparkles-gold", x: 80, y: 10, width: 12, height: 12 },
      { id: "dp3-1", type: "badge", text: "🚀 SERIES A SEED ROUND", fontSize: 11, fontFamily: "mono", fontWeight: "bold", color: "#22C55E", backgroundColor: "#14532D", x: 25, y: 14, width: 50, align: "center", borderRadius: "full" },
      { id: "dp3-2", type: "text", text: "SYNAPSE AI", fontSize: 44, fontFamily: "display", fontWeight: "bold", color: "#FFFFFF", x: 10, y: 24, width: 80, align: "center" },
      { id: "dp3-3", type: "text", text: "DISTRIBUTED INTELLIGENCE AGENTS", fontSize: 12, fontFamily: "mono", fontWeight: "bold", color: "#10B981", x: 10, y: 36, width: 80, align: "center" },
      { id: "dp3-line", type: "shape", shapeType: "line", backgroundColor: "#10B981", x: 20, y: 44, width: 60, height: 1 },
      { id: "dp3-4", type: "text", text: "We orchestrate thousands of micro-reasoning agents simultaneously to solve extreme analytical calculations in real-time. Powering the next generation of automated full-stack production systems.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#9CA3AF", x: 15, y: 50, width: 70, align: "center" }
    ]
  },
  {
    id: "doc-paid-4",
    title: "Corporate Annual Report Cover",
    category: "document",
    tier: "paid",
    description: "Rich majestic burgundy background styled with clean structured symmetry layouts.",
    backgroundColor: "#311010",
    width: 600,
    height: 800,
    elements: [
      { id: "dp4-award", type: "icon", iconName: "Award", color: "#FFFFFF", x: 48, y: 10, width: 4, height: 4 },
      { id: "dp4-1", type: "text", text: "ANNUAL FINANCIAL REPORT", fontSize: 13, fontFamily: "mono", fontWeight: "bold", color: "#FCA5A5", x: 10, y: 16, width: 80, align: "center" },
      { id: "dp4-line1", type: "shape", shapeType: "line", backgroundColor: "#FCA5A5", x: 15, y: 22, width: 70, height: 1 },
      { id: "dp4-2", type: "text", text: "FORTUNE CAPITAL", fontSize: 38, fontFamily: "serif", fontWeight: "bold", color: "#FFFFFF", x: 10, y: 26, width: 80, align: "center" },
      { id: "dp4-line2", type: "shape", shapeType: "line", backgroundColor: "#FCA5A5", x: 15, y: 38, width: 70, height: 1 },
      { id: "dp4-3", type: "text", text: "YEAR 2026 GENERAL REVIEW", fontSize: 12, fontFamily: "sans", fontWeight: "bold", color: "#FCA5A5", x: 10, y: 42, width: 80, align: "center" },
      { id: "dp4-4", type: "text", text: "Our portfolio observed an unprecedented growth rate of 142% this fiscal year. Scaling global infrastructure across Europe, the Americas, and Southeast Asia to reinforce modern asset distribution.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#FEE2E2", x: 15, y: 52, width: 70, align: "center" }
    ]
  },
  {
    id: "doc-paid-5",
    title: "Architectural Brand Standards",
    category: "document",
    tier: "paid",
    description: "Superb minimalist brutalist layout utilizing heavy borders and strict geometric shapes.",
    backgroundColor: "#0F172A",
    width: 600,
    height: 800,
    elements: [
      { id: "dp5-vbar", type: "shape", shapeType: "rectangle", backgroundColor: "#334155", x: 35, y: 0, width: 0.5, height: 100 },
      { id: "dp5-hbar", type: "shape", shapeType: "rectangle", backgroundColor: "#334155", x: 0, y: 30, width: 100, height: 0.5 },
      { id: "dp5-1", type: "text", text: "SYSTEM BRAND STANDARDS", fontSize: 12, fontFamily: "mono", fontWeight: "bold", color: "#F1F5F9", x: 8, y: 10, width: 84, align: "left" },
      { id: "dp5-2", type: "text", text: "KINETIC STUDIO", fontSize: 42, fontFamily: "display", fontWeight: "bold", color: "#FFFFFF", x: 8, y: 16, width: 84, align: "left" },
      { id: "dp5-3", type: "text", text: "Precision layout styling manual detailing architectural spacing, grid parameters, typographic hierarchy, and responsive canvas alignments.", fontSize: 14, fontFamily: "serif", fontWeight: "normal", color: "#94A3B8", x: 8, y: 36, width: 84, align: "left" }
    ]
  },

  // ==========================================
  // FORMS (5 Free, 5 Paid)
  // ==========================================
  {
    id: "form-free-1",
    title: "Simple Feedback Survey",
    category: "form",
    tier: "free",
    description: "Classic clean feedback layout with structured inquiry spaces.",
    backgroundColor: "#FFFFFF",
    width: 600,
    height: 800,
    elements: [
      { id: "ff1-1", type: "text", text: "User Feedback Survey", fontSize: 22, fontFamily: "display", fontWeight: "bold", color: "#111827", x: 10, y: 12, width: 80, align: "center" },
      { id: "ff1-2", type: "text", text: "Please rate your design experience below:", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#4B5563", x: 10, y: 22, width: 80, align: "center" },
      { id: "ff1-s1", type: "icon", iconName: "Star", color: "#FBBF24", x: 32, y: 30, width: 6, height: 6 },
      { id: "ff1-s2", type: "icon", iconName: "Star", color: "#FBBF24", x: 39, y: 30, width: 6, height: 6 },
      { id: "ff1-s3", type: "icon", iconName: "Star", color: "#FBBF24", x: 46, y: 30, width: 6, height: 6 },
      { id: "ff1-s4", type: "icon", iconName: "Star", color: "#FBBF24", x: 53, y: 30, width: 6, height: 6 },
      { id: "ff1-s5", type: "icon", iconName: "Star", color: "#FBBF24", x: 60, y: 30, width: 6, height: 6 },
      { id: "ff1-3", type: "badge", text: "⭐ ⭐ ⭐ ⭐ ⭐ (Excellent)", fontSize: 12, fontFamily: "sans", fontWeight: "medium", color: "#0F766E", backgroundColor: "#CCFBF1", x: 25, y: 38, width: 50, align: "center", borderRadius: "md" },
      { id: "ff1-4", type: "text", text: "What features can we improve next?", fontSize: 13, fontFamily: "sans", fontWeight: "semibold", color: "#374151", x: 10, y: 50, width: 80, align: "left" },
      { id: "ff1-input", type: "badge", text: "✍️ Type comments here...", color: "#9CA3AF", backgroundColor: "#F3F4F6", x: 10, y: 56, width: 80, align: "left", borderRadius: "md" },
      { id: "ff1-submit", type: "badge", text: "SUBMIT SURVEY", color: "#FFFFFF", backgroundColor: "#0F766E", x: 25, y: 70, width: 50, align: "center", borderRadius: "full" }
    ]
  },
  {
    id: "form-free-2",
    title: "Contact Inquiry Form",
    category: "form",
    tier: "free",
    description: "Professional inquiries sheet with text boxes and submit prompts.",
    backgroundColor: "#F8FAFC",
    width: 600,
    height: 800,
    elements: [
      { id: "ff2-1", type: "text", text: "Get In Touch With Us", fontSize: 20, fontFamily: "display", fontWeight: "bold", color: "#1E293B", x: 10, y: 10, width: 80, align: "left" },
      { id: "ff2-line", type: "shape", shapeType: "line", backgroundColor: "#0F172A", x: 10, y: 18, width: 80, height: 1 },
      { id: "ff2-nbg", type: "shape", shapeType: "rectangle", backgroundColor: "#FFFFFF", x: 10, y: 24, width: 80, height: 6, borderRadius: "md" },
      { id: "ff2-nlabel", type: "text", text: "Full Name: John Doe", fontSize: 11, fontFamily: "sans", color: "#64748B", x: 12, y: 25, width: 76, align: "left" },
      { id: "ff2-ebg", type: "shape", shapeType: "rectangle", backgroundColor: "#FFFFFF", x: 10, y: 34, width: 80, height: 6, borderRadius: "md" },
      { id: "ff2-elabel", type: "text", text: "Email Address: example@domain.com", fontSize: 11, fontFamily: "sans", color: "#64748B", x: 12, y: 35, width: 76, align: "left" },
      { id: "ff2-mbg", type: "shape", shapeType: "rectangle", backgroundColor: "#FFFFFF", x: 10, y: 44, width: 80, height: 16, borderRadius: "md" },
      { id: "ff2-mlabel", type: "text", text: "Message Topic details go here...", fontSize: 11, fontFamily: "sans", color: "#64748B", x: 12, y: 46, width: 76, align: "left" },
      { id: "ff2-5", type: "badge", text: "SUBMIT DIRECT CONTACT REQUEST", fontSize: 13, fontFamily: "sans", fontWeight: "bold", color: "#FFFFFF", backgroundColor: "#1E3A8A", x: 15, y: 68, width: 70, align: "center", borderRadius: "md" }
    ]
  },
  {
    id: "form-free-3",
    title: "Newsletter Signup Form",
    category: "form",
    tier: "free",
    description: "Sleek basic card layout designed to scale subscriber databases.",
    backgroundColor: "#F1F5F9",
    width: 600,
    height: 800,
    elements: [
      { id: "ff3-card", type: "shape", shapeType: "rectangle", backgroundColor: "#FFFFFF", x: 8, y: 12, width: 84, height: 68, borderRadius: "lg" },
      { id: "ff3-1", type: "text", text: "Weekly Tech Insights", fontSize: 20, fontFamily: "display", fontWeight: "bold", color: "#0F172A", x: 10, y: 20, width: 80, align: "center" },
      { id: "ff3-2", type: "text", text: "Subscribe for curated guides on React and Node pipelines.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#475569", x: 10, y: 28, width: 80, align: "center" },
      { id: "ff3-input", type: "badge", text: "✉️ Enter email address...", color: "#94A3B8", backgroundColor: "#F1F5F9", x: 16, y: 42, width: 68, align: "center", borderRadius: "md" },
      { id: "ff3-cta", type: "badge", text: "SUBSCRIBE NOW", fontSize: 13, fontFamily: "sans", fontWeight: "bold", color: "#FFFFFF", backgroundColor: "#4F46E5", x: 16, y: 54, width: 68, align: "center", borderRadius: "md" }
    ]
  },
  {
    id: "form-free-4",
    title: "RSVP Confirmation Card",
    category: "form",
    tier: "free",
    description: "Lovely soft wedding or dinner RSVP feedback card.",
    backgroundColor: "#FFFDFB",
    width: 600,
    height: 800,
    elements: [
      { id: "ff4-heart", type: "sticker", stickerUrl: "sticker-rustic-heart", x: 44, y: 10, width: 12, height: 12 },
      { id: "ff4-1", type: "text", text: "Kindly Respond By September 1", fontSize: 18, fontFamily: "serif", fontWeight: "bold", color: "#7C2D12", x: 10, y: 25, width: 80, align: "center" },
      { id: "ff4-tick", type: "badge", text: "✔", color: "#FFFFFF", backgroundColor: "#C2410C", x: 20, y: 40, width: 6, align: "center", borderRadius: "sm" },
      { id: "ff4-opt1", type: "text", text: "Will Attend with absolute pleasure", fontSize: 12, fontFamily: "sans", color: "#431407", x: 28, y: 40, width: 50, align: "left" },
      { id: "ff4-empty", type: "badge", text: " ", color: "#FFFFFF", backgroundColor: "#E2E8F0", x: 20, y: 48, width: 6, align: "center", borderRadius: "sm" },
      { id: "ff4-opt2", type: "text", text: "Must Decline with great regret", fontSize: 12, fontFamily: "sans", color: "#431407", x: 28, y: 48, width: 50, align: "left" }
    ]
  },
  {
    id: "form-free-5",
    title: "Event Registration Form",
    category: "form",
    tier: "free",
    description: "General ticket booking registration layout for events and conferences.",
    backgroundColor: "#FFFFFF",
    width: 600,
    height: 800,
    elements: [
      { id: "ff5-1", type: "text", text: "Global Design Summit 2026", fontSize: 18, fontFamily: "display", fontWeight: "bold", color: "#1E1B4B", x: 10, y: 12, width: 80, align: "center" },
      { id: "ff5-ticket", type: "shape", shapeType: "rectangle", backgroundColor: "#EEF2F6", x: 10, y: 22, width: 80, height: 42, borderRadius: "lg" },
      { id: "ff5-2", type: "badge", text: "TICKET TYPE SELECTION", fontSize: 11, fontFamily: "mono", fontWeight: "bold", color: "#4338CA", backgroundColor: "#FFFFFF", x: 20, y: 26, width: 60, align: "center", borderRadius: "md" },
      { id: "ff5-stub", type: "shape", shapeType: "line", backgroundColor: "#CBD5E1", x: 10, y: 46, width: 80, height: 1 },
      { id: "ff5-3", type: "text", text: "[ ✔ ] Full Access: $299   [  ] Exhibition Only: Free", fontSize: 13, fontFamily: "sans", fontWeight: "medium", color: "#1E293B", x: 10, y: 52, width: 80, align: "center" }
    ]
  },
  {
    id: "form-paid-1",
    title: "VIP Membership Application",
    category: "form",
    tier: "paid",
    description: "Premium obsidian-gold card layout representing ultra luxury surveys.",
    backgroundColor: "#0B0F19",
    width: 600,
    height: 800,
    elements: [
      { id: "fp1-crown", type: "sticker", stickerUrl: "sticker-gold-crown", x: 44, y: 10, width: 12, height: 12 },
      { id: "fp1-badge", type: "badge", text: "👑 VIP MEMBER INVITATION 👑", fontSize: 11, fontFamily: "serif", fontWeight: "bold", color: "#F59E0B", backgroundColor: "#1E1B4B", x: 20, y: 22, width: 60, align: "center", borderRadius: "md" },
      { id: "fp1-2", type: "text", text: "ESTEEMED BLACK CARD CLUB", fontSize: 24, fontFamily: "serif", fontWeight: "bold", color: "#FFFFFF", x: 10, y: 30, width: 80, align: "center" },
      { id: "fp1-cb1", type: "badge", text: "✔", color: "#000000", backgroundColor: "#FBBF24", x: 15, y: 42, width: 6, align: "center", borderRadius: "sm" },
      { id: "fp1-lbl1", type: "text", text: "Assets Valuation > $5,000,000", color: "#F3F4F6", fontSize: 12, x: 24, y: 42, width: 60, align: "left" },
      { id: "fp1-cb2", type: "badge", text: " ", color: "#000000", backgroundColor: "#1E293B", x: 15, y: 50, width: 6, align: "center", borderRadius: "sm" },
      { id: "fp1-lbl2", type: "text", text: "Private Jet or Yacht Owner", color: "#94A3B8", fontSize: 12, x: 24, y: 50, width: 60, align: "left" },
      { id: "fp1-5", type: "badge", text: "APPLY FOR CHARTER MEMBERSHIP", fontSize: 13, fontFamily: "serif", fontWeight: "bold", color: "#000000", backgroundColor: "#FBBF24", x: 15, y: 68, width: 70, align: "center", borderRadius: "full" }
    ]
  },
  {
    id: "form-paid-2",
    title: "Luxury Real Estate Inquiry",
    category: "form",
    tier: "paid",
    description: "Sophisticated beige-gold form for high-end boutique properties.",
    backgroundColor: "#FCFBF7",
    width: 600,
    height: 800,
    elements: [
      { id: "fp2-wreath", type: "sticker", stickerUrl: "sticker-vintage-wreath", x: 43, y: 8, width: 14, height: 14 },
      { id: "fp2-1", type: "text", text: "PENTHOUSE BRIEFING", fontSize: 20, fontFamily: "serif", fontWeight: "bold", color: "#451A03", x: 10, y: 22, width: 80, align: "center" },
      { id: "fp2-box1", type: "shape", shapeType: "rectangle", backgroundColor: "#FFFFFF", x: 15, y: 31, width: 70, height: 6, borderRadius: "md" },
      { id: "fp2-lbl1", type: "text", text: "Preferred Location: New York / Malibu Cliffs", fontSize: 11, color: "#78350F", x: 18, y: 32, width: 64, align: "left" },
      { id: "fp2-box2", type: "shape", shapeType: "rectangle", backgroundColor: "#FFFFFF", x: 15, y: 41, width: 70, height: 6, borderRadius: "md" },
      { id: "fp2-lbl2", type: "text", text: "Target Budget Range: $5,000,000 - $10,000,000", fontSize: 11, color: "#78350F", x: 18, y: 42, width: 64, align: "left" },
      { id: "fp2-4", type: "badge", text: "REQUEST CONCIERGE SCHEDULING", fontSize: 12, fontFamily: "serif", fontWeight: "bold", color: "#FFFFFF", backgroundColor: "#78350F", x: 15, y: 60, width: 70, align: "center", borderRadius: "md" }
    ]
  },
  {
    id: "form-paid-3",
    title: "Creative Agency Brief",
    category: "form",
    tier: "paid",
    description: "Sleek lavender layout with stylish typography for design project intakes.",
    backgroundColor: "#FAF5FF",
    width: 600,
    height: 800,
    elements: [
      { id: "fp3-sp1", type: "sticker", stickerUrl: "sticker-sparkles-gold", x: 44, y: 8, width: 12, height: 12 },
      { id: "fp3-1", type: "text", text: "PROJECT SCOPE BRIEF", fontSize: 22, fontFamily: "display", fontWeight: "bold", color: "#5B21B6", x: 10, y: 20, width: 80, align: "center" },
      { id: "fp3-badge", type: "badge", text: "TELL US ABOUT THE CAMPAIGN", fontSize: 11, fontFamily: "mono", fontWeight: "bold", color: "#FFFFFF", backgroundColor: "#7C3AED", x: 20, y: 28, width: 60, align: "center", borderRadius: "md" },
      { id: "fp3-cb1", type: "badge", text: "✔", color: "#FFFFFF", backgroundColor: "#7C3AED", x: 15, y: 40, width: 6, align: "center", borderRadius: "sm" },
      { id: "fp3-lbl1", type: "text", text: "Full Brand Visual Re-design Campaign", color: "#4C1D95", fontSize: 12, x: 24, y: 40, width: 60, align: "left" },
      { id: "fp3-cb2", type: "badge", text: "✔", color: "#FFFFFF", backgroundColor: "#7C3AED", x: 15, y: 48, width: 6, align: "center", borderRadius: "sm" },
      { id: "fp3-lbl2", type: "text", text: "Custom Interactive Fullstack Web App", color: "#4C1D95", fontSize: 12, x: 24, y: 48, width: 60, align: "left" }
    ]
  },
  {
    id: "form-paid-4",
    title: "Wellness Habit Checklist",
    category: "form",
    tier: "paid",
    description: "Charming botanical mint-green card with checkboxes for daily health tasks.",
    backgroundColor: "#ECFDF5",
    width: 600,
    height: 800,
    elements: [
      { id: "fp4-wreath", type: "sticker", stickerUrl: "sticker-vintage-wreath", x: 44, y: 8, width: 12, height: 12 },
      { id: "fp4-1", type: "text", text: "Daily Wellness Checklist", fontSize: 20, fontFamily: "display", fontWeight: "bold", color: "#065F46", x: 10, y: 20, width: 80, align: "center" },
      { id: "fp4-t1", type: "badge", text: "✔", color: "#FFFFFF", backgroundColor: "#059669", x: 15, y: 32, width: 6, align: "center", borderRadius: "md" },
      { id: "fp4-lbl1", type: "text", text: "30 Minutes Mindfulness Meditation", fontSize: 12, color: "#065F46", x: 24, y: 32, width: 60, align: "left" },
      { id: "fp4-t2", type: "badge", text: "✔", color: "#FFFFFF", backgroundColor: "#059669", x: 15, y: 40, width: 6, align: "center", borderRadius: "md" },
      { id: "fp4-lbl2", type: "text", text: "Drink 3 Liters Clean Water", fontSize: 12, color: "#065F46", x: 24, y: 40, width: 60, align: "left" },
      { id: "fp4-t3", type: "badge", text: " ", color: "#FFFFFF", backgroundColor: "#D1FAE5", x: 15, y: 48, width: 6, align: "center", borderRadius: "md" },
      { id: "fp4-lbl3", type: "text", text: "60 Minutes Gym Strength Routine", fontSize: 12, color: "#047857", x: 24, y: 48, width: 60, align: "left" }
    ]
  },
  {
    id: "form-paid-5",
    title: "VIP Executive Ballot Form",
    category: "form",
    tier: "paid",
    description: "Striking minimalist corporate ballot with dark borders and clear options.",
    backgroundColor: "#FFFFFF",
    width: 600,
    height: 800,
    elements: [
      { id: "fp5-badge", type: "badge", text: "🗳️ BOARD OF DIRECTORS VOTE", fontSize: 11, fontFamily: "mono", fontWeight: "bold", color: "#FFFFFF", backgroundColor: "#1E293B", x: 15, y: 10, width: 70, align: "center", borderRadius: "md" },
      { id: "fp5-2", type: "text", text: "Approve Q3 Corporate Mergers?", fontSize: 18, fontFamily: "serif", fontWeight: "bold", color: "#0F172A", x: 10, y: 22, width: 80, align: "center" },
      { id: "fp5-o1", type: "shape", shapeType: "rectangle", backgroundColor: "#F8FAFC", x: 15, y: 32, width: 70, height: 8, borderRadius: "md" },
      { id: "fp5-o1t", type: "text", text: "[ ✔ ] YES, I AUTHORIZE MERGERS", fontSize: 11, fontFamily: "mono", color: "#1E293B", x: 18, y: 34, width: 64, align: "left" },
      { id: "fp5-o2", type: "shape", shapeType: "rectangle", backgroundColor: "#F8FAFC", x: 15, y: 42, width: 70, height: 8, borderRadius: "md" },
      { id: "fp5-o2t", type: "text", text: "[   ] NO, I REJECT MERGERS", fontSize: 11, fontFamily: "mono", color: "#64748B", x: 18, y: 44, width: 64, align: "left" }
    ]
  },

  // ==========================================
  // EMAILS (5 Free, 5 Paid)
  // ==========================================
  {
    id: "email-free-1",
    title: "Standard Welcome Email",
    category: "email",
    tier: "free",
    description: "Traditional customer greeting layout with standard placeholders.",
    backgroundColor: "#F1F5F9",
    width: 600,
    height: 800,
    elements: [
      { id: "ef1-card", type: "shape", shapeType: "rectangle", backgroundColor: "#FFFFFF", x: 8, y: 10, width: 84, height: 80, borderRadius: "lg" },
      { id: "ef1-icon", type: "icon", iconName: "Mail", color: "#4F46E5", x: 47, y: 15, width: 6, height: 6 },
      { id: "ef1-1", type: "text", text: "Welcome to our Platform!", fontSize: 24, fontFamily: "display", fontWeight: "bold", color: "#111827", x: 10, y: 24, width: 80, align: "center" },
      { id: "ef1-2", type: "text", text: "Hello User,\n\nThank you for creating an account with us. We are excited to support your creative journey. Discover dozens of custom layouts built to streamline your productivity.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#4B5563", x: 14, y: 36, width: 72, align: "left" },
      { id: "ef1-3", type: "badge", text: "👉 Launch Your First Canvas", fontSize: 13, fontFamily: "sans", fontWeight: "bold", color: "#FFFFFF", backgroundColor: "#4F46E5", x: 20, y: 62, width: 60, align: "center", borderRadius: "md" },
      { id: "ef1-foot", type: "text", text: "© 2026 Acme Inc. Unsubscribe anytime.", fontSize: 10, color: "#94A3B8", x: 10, y: 78, width: 80, align: "center" }
    ]
  },
  {
    id: "email-free-2",
    title: "Simple Newsletter Template",
    category: "email",
    tier: "free",
    description: "Sleek newsletter grid layout featuring top story spots.",
    backgroundColor: "#F9FAFB",
    width: 600,
    height: 800,
    elements: [
      { id: "ef2-banner", type: "sticker", stickerUrl: "sticker-retro-banner", x: 30, y: 6, width: 40, height: 10 },
      { id: "ef2-badge", type: "badge", text: "WEEKLY INSIGHTS HUB", fontSize: 11, fontFamily: "mono", fontWeight: "bold", color: "#4B5563", backgroundColor: "#E5E7EB", x: 25, y: 18, width: 50, align: "center", borderRadius: "full" },
      { id: "ef2-2", type: "text", text: "Layout Trends of 2026", fontSize: 22, fontFamily: "display", fontWeight: "bold", color: "#111827", x: 10, y: 28, width: 80, align: "center" },
      { id: "ef2-line", type: "shape", shapeType: "line", backgroundColor: "#E5E7EB", x: 15, y: 40, width: 70, height: 1 },
      { id: "ef2-3", type: "text", text: "Traditional borders are declining. Modern minimalist neutral hues are defining professional aesthetics. Read our curation of top layouts of this summer.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#4B5563", x: 12, y: 44, width: 76, align: "left" }
    ]
  },
  {
    id: "email-free-3",
    title: "Weekly Updates Bulletin",
    category: "email",
    tier: "free",
    description: "Bullet style checklist format email for quick corporate summaries.",
    backgroundColor: "#FFFFFF",
    width: 600,
    height: 800,
    elements: [
      { id: "ef3-award", type: "icon", iconName: "Award", color: "#0284C7", x: 47, y: 8, width: 6, height: 6 },
      { id: "ef3-1", type: "text", text: "SYSTEM BULLETIN UPDATE", fontSize: 16, fontFamily: "display", fontWeight: "bold", color: "#0369A1", x: 10, y: 16, width: 80, align: "center" },
      { id: "ef3-line", type: "shape", shapeType: "line", backgroundColor: "#BAE6FD", x: 20, y: 24, width: 60, height: 1 },
      { id: "ef3-2", type: "text", text: "Core upgrades made this Tuesday:\n- Server bundling optimized with esbuild\n- Direct PDF export tools refactored\n- Security rules applied to portfolio stores", fontSize: 13, fontFamily: "mono", fontWeight: "medium", color: "#0F766E", x: 12, y: 28, width: 76, align: "left" }
    ]
  },
  {
    id: "email-free-4",
    title: "Product Sale Announcement",
    category: "email",
    tier: "free",
    description: "High-contrast discount banner layout with visible CTAs.",
    backgroundColor: "#FAF7F0",
    width: 600,
    height: 800,
    elements: [
      { id: "ef4-sparkle", type: "sticker", stickerUrl: "sticker-sparkles-gold", x: 74, y: 10, width: 12, height: 12 },
      { id: "ef4-1", type: "text", text: "ANNUAL HARVEST SALE", fontSize: 24, fontFamily: "serif", fontWeight: "bold", color: "#7C2D12", x: 10, y: 18, width: 80, align: "center" },
      { id: "ef4-2", type: "text", text: "Enjoy up to 50% off on premium canvas presets. Offer expires soon.", fontSize: 13, fontFamily: "sans", fontWeight: "medium", color: "#9A3412", x: 10, y: 28, width: 80, align: "center" },
      { id: "ef4-3", type: "badge", text: "CLAIM 50% DISCOUNT NOW", fontSize: 13, fontFamily: "sans", fontWeight: "bold", color: "#FFFFFF", backgroundColor: "#C2410C", x: 20, y: 42, width: 60, align: "center", borderRadius: "md" }
    ]
  },
  {
    id: "email-free-5",
    title: "Event Invite Newsletter",
    category: "email",
    tier: "free",
    description: "Centered layout to pitch events or webinars to clients.",
    backgroundColor: "#FFFBFB",
    width: 600,
    height: 800,
    elements: [
      { id: "ef5-wreath", type: "sticker", stickerUrl: "sticker-vintage-wreath", x: 43, y: 8, width: 14, height: 14 },
      { id: "ef5-1", type: "text", text: "YOU ARE INVITED", fontSize: 18, fontFamily: "serif", fontWeight: "bold", color: "#9F1239", x: 10, y: 24, width: 80, align: "center" },
      { id: "ef5-2", type: "text", text: "Join our masterclass on modern visual layout structures.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#BE123C", x: 10, y: 34, width: 80, align: "center" },
      { id: "ef5-pin", type: "icon", iconName: "MapPin", color: "#BE123C", x: 48, y: 44, width: 4, height: 4 }
    ]
  },
  {
    id: "email-paid-1",
    title: "Modern SaaS Product Launch",
    category: "email",
    tier: "paid",
    description: "Magnificent purple hero design with rich call-to-actions for high conversion campaigns.",
    backgroundColor: "#FAF9F6",
    width: 600,
    height: 800,
    elements: [
      { id: "ep1-card", type: "shape", shapeType: "rectangle", backgroundColor: "#FFFFFF", x: 8, y: 10, width: 84, height: 80, borderRadius: "lg" },
      { id: "ep1-spark", type: "icon", iconName: "Sparkles", color: "#7C3AED", x: 47, y: 14, width: 6, height: 6 },
      { id: "ep1-badge", type: "badge", text: "⚡ NEW FEATURE REVEAL ⚡", fontSize: 11, fontFamily: "mono", fontWeight: "bold", color: "#FFFFFF", backgroundColor: "#7C3AED", x: 25, y: 22, width: 50, align: "center", borderRadius: "md" },
      { id: "ep1-2", type: "text", text: "The Smartest Editor is Live", fontSize: 28, fontFamily: "display", fontWeight: "bold", color: "#111111", x: 10, y: 31, width: 80, align: "center" },
      { id: "ep1-3", type: "text", text: "We've added an advanced Gemini AI companion that instantly writes beautiful proposal and survey copies directly in your visual workspace. Fast, secure, and beautiful.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#4B5563", x: 14, y: 44, width: 72, align: "left" },
      { id: "ep1-4", type: "badge", text: "👉 EXPLORE AI PRESETS FREE", fontSize: 13, fontFamily: "display", fontWeight: "bold", color: "#FFFFFF", backgroundColor: "#7C3AED", x: 20, y: 64, width: 60, align: "center", borderRadius: "md" }
    ]
  },
  {
    id: "email-paid-2",
    title: "Cyberpunk Tech Sale",
    category: "email",
    tier: "paid",
    description: "Glow aesthetic layout featuring rich neon-pink highlights over high contrast black.",
    backgroundColor: "#05050A",
    width: 600,
    height: 800,
    elements: [
      { id: "ep2-stripe1", type: "shape", shapeType: "rectangle", backgroundColor: "#F43F5E", x: 10, y: 12, width: 80, height: 1 },
      { id: "ep2-1", type: "text", text: "CYBERPUNK DEALS ONLINE", fontSize: 11, fontFamily: "mono", fontWeight: "bold", color: "#F43F5E", x: 10, y: 16, width: 80, align: "center" },
      { id: "ep2-2", type: "text", text: "SYSTEM OVERLOAD: 80% OFF", fontSize: 26, fontFamily: "display", fontWeight: "bold", color: "#FFFFFF", x: 10, y: 24, width: 80, align: "center" },
      { id: "ep2-stripe2", type: "shape", shapeType: "rectangle", backgroundColor: "#F43F5E", x: 10, y: 36, width: 80, height: 1 },
      { id: "ep2-3", type: "text", text: "Access premium digital canvases, AI copy assistants, and full admin tools for a tiny fraction of the standard licensing price.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#9CA3AF", x: 12, y: 42, width: 76, align: "center" },
      { id: "ep2-4", type: "badge", text: "⚡ BOOT SYSTEM ACCELERATOR ⚡", fontSize: 12, fontFamily: "mono", fontWeight: "bold", color: "#000000", backgroundColor: "#F43F5E", x: 15, y: 58, width: 70, align: "center", borderRadius: "md" }
    ]
  },
  {
    id: "email-paid-3",
    title: "Editorial Fashion Newsletter",
    category: "email",
    tier: "paid",
    description: "Highly refined layout matching luxury apparel and minimalist catalogs.",
    backgroundColor: "#FAF9F6",
    width: 600,
    height: 800,
    elements: [
      { id: "ep3-1", type: "text", text: "THE MODERN CATALOGUE", fontSize: 12, fontFamily: "serif", fontWeight: "medium", color: "#78716C", x: 10, y: 12, width: 80, align: "center" },
      { id: "ep3-2", type: "text", text: "Autumn Minimalist Linen", fontSize: 28, fontFamily: "serif", fontWeight: "bold", color: "#1C1917", x: 10, y: 18, width: 80, align: "center" },
      { id: "ep3-img", type: "shape", shapeType: "rectangle", backgroundColor: "#E7E5E4", x: 15, y: 30, width: 70, height: 26, borderRadius: "lg" },
      { id: "ep3-imglbl", type: "text", text: "📷 AUTUMN COZY KNITWEAR SHOT", fontSize: 10, fontFamily: "mono", color: "#78716C", x: 15, y: 40, width: 70, align: "center" },
      { id: "ep3-3", type: "text", text: "A curated curation of breathable linens, warm earth shades, and elegant geometric tailoring. Pure comfort meets modern structure.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#44403C", x: 15, y: 58, width: 70, align: "center" }
    ]
  },
  {
    id: "email-paid-4",
    title: "Dark Mode Product Release",
    category: "email",
    tier: "paid",
    description: "Deep obsidian backdrop featuring modern blue accent badges and high contrast text.",
    backgroundColor: "#030712",
    width: 600,
    height: 800,
    elements: [
      { id: "ep4-badge", type: "badge", text: "🌌 NEON ENGINE V2.0", fontSize: 10, fontFamily: "mono", fontWeight: "bold", color: "#38BDF8", backgroundColor: "#1E293B", x: 25, y: 10, width: 50, align: "center", borderRadius: "full" },
      { id: "ep4-2", type: "text", text: "Extreme Visual Power", fontSize: 24, fontFamily: "display", fontWeight: "bold", color: "#FFFFFF", x: 10, y: 20, width: 80, align: "center" },
      { id: "ep4-product", type: "shape", shapeType: "rectangle", backgroundColor: "#1E293B", x: 10, y: 30, width: 80, height: 32, borderRadius: "lg" },
      { id: "ep4-spark", type: "sticker", stickerUrl: "sticker-sparkles-gold", x: 44, y: 36, width: 12, height: 12 },
      { id: "ep4-3", type: "text", text: "Experience ultra-fast rendering with zero lag. Our custom state machine caches assets locally for offline-first design productivity.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#9CA3AF", x: 15, y: 65, width: 70, align: "center" }
    ]
  },
  {
    id: "email-paid-5",
    title: "VIP Loyalty Reward Invitation",
    category: "email",
    tier: "paid",
    description: "Luxury deep royal indigo theme with silver-amber typographic balance.",
    backgroundColor: "#1E1B4B",
    width: 600,
    height: 800,
    elements: [
      { id: "ep5-frame", type: "shape", shapeType: "rectangle", backgroundColor: "#312E81", x: 8, y: 10, width: 84, height: 80, borderRadius: "lg" },
      { id: "ep5-crown", type: "sticker", stickerUrl: "sticker-gold-crown", x: 44, y: 14, width: 12, height: 12 },
      { id: "ep5-badge", type: "badge", text: "👑 EXCLUSIVE SEED OFFER", fontSize: 11, fontFamily: "mono", fontWeight: "bold", color: "#FBBF24", backgroundColor: "#1E1B4B", x: 25, y: 26, width: 50, align: "center", borderRadius: "md" },
      { id: "ep5-2", type: "text", text: "Invitation Only Access", fontSize: 24, fontFamily: "serif", fontWeight: "bold", color: "#FFFFFF", x: 10, y: 36, width: 80, align: "center" },
      { id: "ep5-3", type: "text", text: "As a highly valued partner, enjoy lifetime premium presets, early releases of AI products, and 24/7 dedicated system support engineers.", fontSize: 13, fontFamily: "sans", fontWeight: "normal", color: "#C7D2FE", x: 12, y: 48, width: 76, align: "center" }
    ]
  }
];
