export type TemplateCategory = 'wedding' | 'document' | 'form' | 'email';

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'badge' | 'sticker' | 'icon';
  text?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'medium' | 'bold' | 'semibold';
  fontFamily?: 'sans' | 'display' | 'mono' | 'serif' | 'playfair' | 'outfit' | 'space';
  color?: string;
  backgroundColor?: string;
  x: number; // percentage width relative to canvas (0-100)
  y: number; // percentage height relative to canvas (0-100)
  width?: number; // percentage (0-100)
  height?: number; // percentage (0-100)
  align?: 'left' | 'center' | 'right' | 'justify';
  placeholder?: string;
  borderRadius?: string;
  
  // Advanced features requested:
  italic?: boolean;
  underline?: boolean;
  letterSpacing?: number; // in pixels
  lineHeight?: number; // line-height multiplier (e.g. 1.2)
  rotate?: number; // rotation in degrees
  opacity?: number; // transparency 0-100
  locked?: boolean; // layer locking
  
  // Image properties
  imageUrl?: string;
  cropX?: number; // cropping coordinates
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  isCropping?: boolean;
  
  // Shape/Icon specifics
  shapeType?: 'rectangle' | 'circle' | 'triangle' | 'star' | 'heart' | 'line';
  iconName?: string; // Lucide icon name or customized SVGs
  stickerUrl?: string; // Cute illustration/sticker links or keys
}

export interface Template {
  id: string;
  title: string;
  category: TemplateCategory;
  description: string;
  backgroundColor: string;
  backgroundGradient?: string; // e.g. "linear-gradient(to right, ...)"
  backgroundImage?: string; // image url
  width: number; // Aspect width
  height: number; // Aspect height
  elements: CanvasElement[];
  isAdminPreset?: boolean;
  tier?: 'free' | 'paid';
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'user' | 'admin';
  isPro?: boolean;
}

export interface Design {
  id: string;
  userId: string;
  templateId: string;
  title: string;
  category: TemplateCategory;
  backgroundColor: string;
  elements: CanvasElement[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
