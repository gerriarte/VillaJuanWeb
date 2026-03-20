import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#256D00', // Deep Moss
        primary_container: '#54A82F',
        secondary: '#8D4F00', // Burnished Clay
        secondary_container: '#FE9824',
        tertiary: '#934B19', // Aged Wood
        surface: '#FEF7FF',
        on_surface: '#1D1A22',
        surface_container_lowest: '#FFFFFF',
        surface_container_low: '#F8F2FB',
        surface_container: '#F2ECF5',
        surface_container_high: '#ECDFEF',
        surface_container_highest: '#E6D7E9',
      },
      fontFamily: {
        'display': ['var(--font-noto-serif)', 'serif'], // Títulos
        'body': ['var(--font-manrope)', 'sans-serif'], // Cuerpo
      },
      borderRadius: {
        'md': '0.75rem',
        'lg': '1rem',
        'full': '9999px',
      },
      boxShadow: {
        'ambient': '0px 12px 32px rgba(29, 26, 34, 0.06)',
      },
      lineHeight: {
        'relaxed-custom': '1.6',
      },
      transitionDuration: {
        '800': '800ms',
      },
      transitionTimingFunction: {
        'organic': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'atmosphere-transition': 'atmosphereTransition 0.8s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        atmosphereTransition: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config