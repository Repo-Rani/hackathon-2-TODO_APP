import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
      boxShadow: {
        'sm-light': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md-light': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'lg-light': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'xl-light': '0 20px 25px rgba(0, 0, 0, 0.15)',
        'sm-dark': '0 1px 2px rgba(0, 0, 0, 0.3)',
        'md-dark': '0 4px 6px rgba(0, 0, 0, 0.4)',
        'lg-dark': '0 10px 15px rgba(0, 0, 0, 0.5)',
        'xl-dark': '0 20px 25px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
} satisfies Config;