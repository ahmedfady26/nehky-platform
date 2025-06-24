/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // نقاط توقف محسنة للتوافق مع الموبايل
      screens: {
        'xs': '320px',
        'sm': '425px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1440px',
        '2xl': '2560px',
        // للتوجهات
        'portrait': { 'raw': '(orientation: portrait)' },
        'landscape': { 'raw': '(orientation: landscape)' },
      },
      colors: {
        // تدرج بين الأزرق والأخضر لمنصة نحكي
        primary: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff',
          600: '#096dd9',
          700: '#0050b3',
          800: '#003a8c',
          900: '#002766',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // ألوان مخصصة للمنصة
        nehky: {
          blue: '#1e40af',
          green: '#059669',
          gradient: 'linear-gradient(135deg, #1e40af 0%, #059669 100%)',
        }
      },
      
      // مسافات للمس المناسب في الموبايل
      spacing: {
        'touch': '44px', // iOS minimum touch target
        'touch-android': '48px', // Android minimum touch target
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
        system: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'nehky-gradient': 'linear-gradient(135deg, #1e40af 0%, #059669 100%)',
      },
    },
  },
  plugins: [],
}
