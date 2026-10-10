import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF8C00', // Orange as requested
        secondary: '#111827', // dark gray-black for text
        tertiary: '#6B7280', // Gray for secondary text
        'surface': '#F9FAFB', // Background
        'surface-white': '#FFFFFF',
        'surface-border': '#E5E7EB', // Lighter border
        
        status: {
          new: {
            bg: '#E0F2FE',
            text: '#0369A1'
          },
          pending: {
            bg: '#FEF3C7',
            text: '#B45309'
          },
          confirmed: {
            bg: '#DCFCE7',
            text: '#15803D'
          },
          failed: {
            bg: '#FEE2E2',
            text: '#B91C1C'
          },
          refunded: {
            bg: '#F3F4F6',
            text: '#4B5563'
          }
        }
      },
      fontFamily: {
        jakarta: ['var(--font-sans)', 'sans-serif'],
      },
      fontSize: {
        'headline-xl': ['28px', { fontWeight: '700', lineHeight: '36px' }], // H1
        'headline-lg': ['24px', { fontWeight: '700' }],
        'headline-md': ['20px', { fontWeight: '600' }],
        'headline-sm': ['16px', { fontWeight: '600' }],
        'body-lg': ['16px', { fontWeight: '400' }],
        'body-md': ['14px', { fontWeight: '400', lineHeight: '20px' }], // Body
        'body-sm': ['13px', { fontWeight: '400' }],
      },
      borderRadius: {
        'card': '12px',
        'btn': '8px',
      },
      spacing: {
        'space-xs': '0.5rem',
        'space-sm': '0.75rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
        'section-gap': '32px',
        'card-p': '20px',
        'element-gap': '16px',
        'col-gap': '24px',
        'sidebar-w': '240px',
        'sidebar-collapsed-w': '80px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(10, 37, 64, 0.04), 0 1px 2px -1px rgba(10, 37, 64, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(10, 37, 64, 0.08), 0 8px 10px -6px rgba(10, 37, 64, 0.04)',
        'modal': '0 20px 35px -10px rgba(10, 37, 64, 0.16)',
      }
    },
  },
  plugins: [],
}

export default config
