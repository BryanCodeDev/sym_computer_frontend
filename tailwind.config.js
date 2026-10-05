/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
          primary: {
             50: '#FFFFFF',
             100: '#FFFFFF',
             200: '#F5F5F5',
             300: '#EEEEEE',
             400: '#E0E0E0',
             500: '#BDBDBD',
             600: '#9E9E9E',
             700: '#757575',
             800: '#000000',
             900: '#000000',
             950: '#000000',
          },
         accent: {
           50: '#FEF2F2',
           100: '#FEE2E2',
           200: '#FECACA',
           300: '#FCA5A5',
           400: '#F87171',
           500: '#971111',
           600: '#7A0E0E',
           700: '#5C0A0A',
           800: '#3E0707',
           900: '#2A0505',
         },
          white: {
            DEFAULT: '#FFFFFF',
            soft: '#FAFAFA',
          },
          black: {
            DEFAULT: '#000000',
            soft: '#1A1A1A',
          },
          charcoal: {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#EEEEEE',
            300: '#E0E0E0',
            400: '#BDBDBD',
            500: '#9E9E9E',
            600: '#000000',
            700: '#000000',
            800: '#000000',
            900: '#000000',
          },
          mustard: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            200: '#FECACA',
            300: '#FCA5A5',
            400: '#F87171',
            500: '#971111',
            600: '#7A0E0E',
            700: '#5C0A0A',
            800: '#3E0707',
            900: '#2A0505',
          }
       },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'SlideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-charcoal': 'pulseCharcoal 2s infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseCharcoal: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(151, 17, 17, 0.3)' },
          '50%': { boxShadow: '0 0 0 8px rgba(151, 17, 17, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-accent': 'linear-gradient(135deg, #971111 0%, #7A0E0E 50%, #5C0A0A 100%)',
        'gradient-dark': 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
        'gradient-card': 'linear-gradient(145deg, #FFFFFF 0%, #F5F5F5 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(0,0,0,0.03), transparent)',
      },
      boxShadow: {
        'accent': '0 4px 20px rgba(151, 17, 17, 0.25)',
        'accent-sm': '0 1px 4px rgba(151, 17, 17, 0.20)',
        'accent-lg': '0 8px 32px rgba(151, 17, 17, 0.22)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 8px 20px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05)',
      },
      borderWidth: {
        '1': '1px',
      },
        borderColor: {
          'accent-50': '#FEF2F2',
          'accent-100': '#FEE2E2',
          'accent-200': '#FECACA',
          'accent-300': '#FCA5A5',
          'accent-400': '#F87171',
          'accent-500': '#971111',
          'accent-600': '#7A0E0E',
          'accent-700': '#5C0A0A',
          'accent-800': '#3E0707',
          'accent-900': '#2A0505',
          'neutral-100': '#F5F5F5',
          'neutral-200': '#EEEEEE',
          'neutral-300': '#E0E0E0',
          'neutral-400': '#BDBDBD',
          'neutral-500': '#9E9E9E',
          'neutral-600': '#757575',
          'neutral-700': '#616161',
          'neutral-800': '#424242',
          'neutral-900': '#000000',
          'dark-border': '#E0E0E0',
          'dark-border-light': '#EEEEEE',
        },
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }
    },
  },
  plugins: [],
}