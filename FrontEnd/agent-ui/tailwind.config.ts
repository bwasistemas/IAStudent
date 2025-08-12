import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'
import tailwindcssForms from '@tailwindcss/forms'

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // AFYA Brand Colors
        brand: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#CE0058', // Primary AFYA Magenta
          600: '#B91C5C',
          700: '#A3174B',
          800: '#831843',
          900: '#7F1D3C',
          '600-alt': '#D31C5B' // Legacy alias - avoid using by default
        },
        
        // Neutral Gray Scale (objective and accessible)
        gray: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1F2937',
          900: '#0F172A'
        },

        // AFYA Custom Colors
        darkGray: '#232323', // AFYA Dark Gray
        lightGray: '#8E9794', // AFYA Light Gray
        
        // AFYA Brand Colors (for direct usage in components)
        'afya-magenta': '#CE0058',
        'afya-magenta-hover': '#B91C5C',
        'afya-dark-gray': '#232323',
        'afya-light-gray': '#8E9794',

        // Feedback Colors
        success: {
          500: '#16A34A'
        },
        warning: {
          500: '#D97706'
        },
        danger: {
          500: '#DC2626'
        },
        info: {
          500: '#2563EB'
        },

        // Semantic aliases for shadcn/ui compatibility
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      
      fontFamily: {
        // Primary typography: Gotham with web-safe fallbacks
        primary: ['Gotham', 'Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        gotham: ['Gotham', 'Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        'gotham-light': ['Gotham Light', 'Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        'gotham-book': ['Gotham Book', 'Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        'gotham-regular': ['Gotham Regular', 'Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Gotham', 'Montserrat', 'Inter', 'system-ui', 'sans-serif']
      },
      
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      
      // Focus ring configuration for accessibility
      outline: {
        brand: ['2px solid #CE0058', '2px'],
      },
      
      // Animation improvements for reduced motion
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: [
    tailwindcssAnimate,
    tailwindcssForms
  ]
} satisfies Config
