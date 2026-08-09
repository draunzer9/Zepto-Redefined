/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        z: {
          purple: '#3B0066',
          'purple-dark': '#2D0050',
          'purple-light': '#F0E6FF',
          pink: '#E01A76',
          'pink-light': '#FFF0F6',
          green: '#0C831F',
          'green-light': '#E8F5E9',
          yellow: '#FFC107',
          red: '#FF3B30',
          gray: {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#E8E8E8',
            300: '#D4D4D4',
            400: '#A3A3A3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
          },
        },
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
        'drawer': '-8px 0 40px rgba(0,0,0,0.15)',
        'bottom-drawer': '0 -8px 40px rgba(0,0,0,0.15)',
        'header': '0 2px 8px rgba(0,0,0,0.12)',
        'button': '0 2px 8px rgba(12,131,31,0.3)',
      },
      borderRadius: {
        'zepto': '12px',
      },
    },
  },
  plugins: [],
}
