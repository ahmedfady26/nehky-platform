/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE', 
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',  // Main primary
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',  // Primary
          900: '#1E3A8A',  // Primary dark
        },
        // Secondary Colors
        secondary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0', 
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',  // Secondary
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // Accent Colors
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D', 
          400: '#FBBF24',
          500: '#F59E0B',  // Accent
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Status Colors
        success: '#10B981',
        warning: '#F59E0B', 
        error: '#EF4444',
        info: '#3B82F6',
        // Arabic Theme Colors
        nehky: {
          primary: '#1E40AF',
          secondary: '#059669',
          accent: '#F59E0B',
          background: '#F9FAFB',
          surface: '#FFFFFF',
          text: '#111827',
          'text-light': '#6B7280',
        }
      },
      fontFamily: {
        // Arabic + English Support
        sans: ['Cairo', 'Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
        english: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Responsive Typography
        'xs': ['0.75rem', { lineHeight: '1rem' }],     // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],    // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
        '5xl': ['3rem', { lineHeight: '1' }],          // 48px
      },
      spacing: {
        // Touch-friendly spacing
        'touch': '2.75rem', // 44px minimum touch target
        'safe': '1rem',     // Safe area spacing
      },
      screens: {
        // Custom breakpoints
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
        // Device-specific
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1023px'},
        'desktop': {'min': '1024px'},
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',   // 2px
        'DEFAULT': '0.25rem', // 4px
        'md': '0.375rem',   // 6px
        'lg': '0.5rem',     // 8px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
        'full': '9999px',
      },
      boxShadow: {
        // Soft shadows for mobile
        'soft': '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'soft-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        // Interactive shadows
        'interactive': '0 4px 6px -1px rgba(59, 130, 246, 0.1)',
        'interactive-lg': '0 10px 15px -3px rgba(59, 130, 246, 0.1)',
      },
      animation: {
        // Smooth animations
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
          '40%, 43%': { transform: 'translateY(-8px)' },
          '70%': { transform: 'translateY(-4px)' },
          '90%': { transform: 'translateY(-2px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
  // Dark mode support
  darkMode: 'class',
}
