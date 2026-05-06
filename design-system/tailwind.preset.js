/**
 * Atlas Assistants Design System — Tailwind Preset v1.0
 *
 * Usage in tailwind.config.js:
 *   const atlasPreset = require('./design-system/tailwind.preset');
 *   module.exports = { presets: [atlasPreset], ... };
 *
 * Or for Tailwind v4 in CSS:
 *   @import './design-system/tokens.css';
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        atlas: {
          green: {
            50:  '#EDFDF4',
            100: '#D4F9E6',
            200: '#A8F2CA',
            300: '#72E8AA',
            400: '#3DD98A',
            500: '#13C96F',
            600: '#0DAF5F',
            700: '#088C4B',
            800: '#066B39',
            900: '#044825',
          },
          navy: {
            50:  '#EEF1F8',
            100: '#D8DDF0',
            200: '#B0BAE2',
            300: '#7A8CCA',
            400: '#4A5EA8',
            500: '#243580',
            600: '#1A2760',
            700: '#131D46',
            800: '#0D142E',
            900: '#080E1C',
            950: '#040810',
          },
          gold: {
            50:  '#FFFBF0',
            100: '#FEF3D6',
            200: '#FCE3B2',
            300: '#FAD07E',
            400: '#F7BA52',
            500: '#F5A623',
            600: '#D48910',
            700: '#A86B0A',
            800: '#7C4E06',
            900: '#4E3002',
          },
          neutral: {
            50:  '#F4F6FA',
            100: '#E6EDF5',
            200: '#CDD9E8',
            300: '#A8BAD0',
            400: '#7D93AE',
            500: '#5A6E88',
            600: '#3D4F66',
            700: '#2A3446',
            800: '#1C2230',
            900: '#10141A',
            950: '#080A0C',
          },
        },
      },

      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans:    ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Courier New', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },

      borderRadius: {
        sm:   '4px',
        md:   '8px',
        lg:   '12px',
        xl:   '16px',
        '2xl':'24px',
      },

      boxShadow: {
        'glow-green': '0 0 30px rgba(19, 201, 111, 0.30)',
        'glow-gold':  '0 0 30px rgba(245, 166, 35, 0.30)',
      },

      transitionTimingFunction: {
        'atlas':  'cubic-bezier(0.2, 0, 0, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },

      transitionDuration: {
        '50':  '50ms',
        '350': '350ms',
        '500': '500ms',
        '800': '800ms',
      },

      spacing: {
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },

      zIndex: {
        '60':  '60',
        '70':  '70',
        '80':  '80',
        '90':  '90',
        '100': '100',
      },

      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        'slide-down': {
          '0%':   { transform: 'translateY(-12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        'scale-in': {
          '0%':   { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0'  },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(19, 201, 111, 0.2)' },
          '50%':      { boxShadow: '0 0 40px rgba(19, 201, 111, 0.5)' },
        },
      },

      animation: {
        'fade-in':   'fade-in 0.3s ease-out',
        'slide-up':  'slide-up 0.4s cubic-bezier(0, 0, 0.2, 1)',
        'slide-down':'slide-down 0.4s cubic-bezier(0, 0, 0.2, 1)',
        'scale-in':  'scale-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shimmer':   'shimmer 1.5s infinite linear',
        'glow-pulse':'glow-pulse 2s ease-in-out infinite',
      },

      backgroundImage: {
        'atlas-gradient':     'linear-gradient(135deg, #13C96F 0%, #3DD98A 100%)',
        'atlas-gradient-gold':'linear-gradient(135deg, #F5A623 0%, #F7BA52 100%)',
        'atlas-gradient-dark':'linear-gradient(180deg, #080E1C 0%, #040810 100%)',
        'atlas-mesh':         'radial-gradient(at 40% 20%, rgba(19,201,111,0.08) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(245,166,35,0.05) 0px, transparent 50%)',
      },
    },
  },

  plugins: [],
};
