import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Apple-style glassmorphism card styles
 * @param options - Optional customization
 * @returns Inline styles object for glassmorphism effect
 */
export function glassStyle(options?: {
  opacity?: number;        // Background opacity (default: 0.03)
  blur?: number;          // Backdrop blur in px (default: 12)
  saturation?: number;    // Saturation boost % (default: 140)
  borderColor?: string;   // Border color (default: rgba(255,255,255,0.08))
  shadowDepth?: 'sm' | 'md' | 'lg'; // Shadow depth (default: 'sm')
}) {
  const {
    opacity = 0.03,
    blur = 12,              // Reduced from 16 for better performance
    saturation = 140,       // Reduced from 160
    borderColor = `rgba(255,255,255,${opacity * 2.67})`,
    shadowDepth = 'sm'
  } = options || {};

  const shadows = {
    sm: `0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,${opacity * 1.67})`,
    md: `0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,${opacity * 1.67})`,
    lg: `0 12px 48px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,${opacity * 1.67})`
  };

  return {
    background: `rgba(255,255,255,${opacity})`,
    backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    borderColor,
    boxShadow: shadows[shadowDepth]
  };
}

/**
 * Glassmorphism highlight gradient (for top edge)
 */
export const glassHighlight = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  height: '1px',
  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)'
};
