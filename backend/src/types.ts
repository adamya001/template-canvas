export type TemplateCategory = 'wedding' | 'document' | 'form' | 'email';

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'badge';
  text?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'medium' | 'bold' | 'semibold';
  fontFamily?: 'sans' | 'display' | 'mono' | 'serif';
  color?: string;
  backgroundColor?: string;
  x: number; // percentage width relative to canvas (0-100)
  y: number; // percentage height relative to canvas (0-100)
  width?: number; // percentage (0-100)
  height?: number; // percentage (0-100)
  align?: 'left' | 'center' | 'right';
  placeholder?: string;
  borderRadius?: string;
}

export interface Template {
  id: string;
  title: string;
  category: TemplateCategory;
  description: string;
  backgroundColor: string;
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
