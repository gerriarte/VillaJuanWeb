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
        // Base Neutra (Interfaz General)
        primary: '#F9F4F0', // Hueso/Arena suave - Fondo primario
        text: '#2D2926', // Carboncillo orgánico - Texto principal
        accent: '#5E9E16', // Verde Orgánico - Color Principal
        secondary: '#FFA600', // Ámbar Tech - Color Secundario
        
        // Paleta de Experiencia (Atmósferas de Fondo)
        atmosphere: {
          trote: '#2E4739', // Verde - Bosque, serenidad, crecimiento
          trocha: '#8B3A32', // Rojo - Arcilla, fuego del barril, energía
          'paso-fino': '#D4A373', // Amarillo - Atardecer, trigo, exclusividad
        }
      },
      fontFamily: {
        'display': ['var(--font-fraunces)', 'serif'], // Títulos H1, H2
        'heading': ['var(--font-montserrat)', 'sans-serif'], // Subtítulos y botones
        'body': ['var(--font-inter)', 'sans-serif'], // Cuerpo de texto
      },
      borderRadius: {
        'organic': '16px',
        'organic-lg': '32px',
      },
      boxShadow: {
        'organic': '0 10px 40px -10px rgba(99, 72, 50, 0.15)',
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