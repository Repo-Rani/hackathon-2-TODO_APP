import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Design system constants
export const DESIGN_SYSTEM = {
  colors: {
    primary: {
      DEFAULT: '#FF6B35', // Orange
      hover: '#FF8C61',
      dark: '#E85A2A',
      light: '#FFA587',
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    }
  },
  typography: {
    headings: {
      '6xl': '3.75rem',  // Hero
      '5xl': '3rem',     // Section Headers
      '4xl': '2.25rem',  // Sub Headers
      '3xl': '1.875rem', // Card Titles
      '2xl': '1.5rem',   // Large Text
      'xl': '1.25rem',   // Body Large
      'lg': '1.125rem',  // Body
      'base': '1rem',    // Base
      'sm': '0.875rem',  // Small
    },
    families: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace',
    }
  },
  spacing: {
    '1': '0.25rem',   // 4px
    '2': '0.5rem',    // 8px
    '3': '0.75rem',   // 12px
    '4': '1rem',      // 16px
    '6': '1.5rem',    // 24px
    '8': '2rem',      // 32px
    '12': '3rem',     // 48px
    '16': '4rem',     // 64px
    '24': '6rem',     // 96px
  },
  borderRadius: {
    sm: '0.375rem',   // 6px - buttons, inputs
    md: '0.5rem',     // 8px - cards
    lg: '0.75rem',    // 12px - modals
    xl: '1rem',       // 16px - hero sections
    full: '9999px',   // Full round - avatars
  },
  shadows: {
    light: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.07)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
    },
    dark: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.6)',
    }
  }
};
