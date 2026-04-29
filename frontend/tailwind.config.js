/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Light theme palette ──────────────────────────────
        app:     '#f0f4f8',   // page background
        card:    '#ffffff',   // white card
        section: '#f8fafc',   // off-white section bg

        // Accent colours
        purple: {
          DEFAULT: '#6c3fc5',
          light:   '#8b5cf6',
          50:      '#f5f3ff',
          100:     '#ede9fe',
          200:     '#ddd6fe',
          600:     '#7c3aed',
          700:     '#6d28d9',
        },
        teal: {
          DEFAULT: '#0d9488',
          light:   '#14b8a6',
          50:      '#f0fdfa',
          100:     '#ccfbf1',
        },
        coral: {
          DEFAULT: '#f43f5e',
          light:   '#fb7185',
          50:      '#fff1f2',
          100:     '#ffe4e6',
        },

        // Text
        ink:   '#1e293b',  // primary text
        muted: '#64748b',  // secondary text

        // Borders
        border: '#e2e8f0',

        // Legacy compatibility
        brand: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        surface: {
          DEFAULT: '#ffffff',
          2:       '#f8fafc',
          3:       '#f0f4f8',
        },

        // Admin amber accent
        amber: {
          DEFAULT: '#f59e0b',
          dark:    '#d97706',
          light:   '#fcd34d',
          50:      '#fffbeb',
          100:     '#fef3c7',
        },
      },
      borderRadius: {
        xl:  '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        card:   '0 2px 8px rgba(0,0,0,0.08)',
        medium: '0 4px 16px rgba(0,0,0,0.10)',
        soft:   '0 8px 24px rgba(0,0,0,0.06)',
        purple: '0 4px 16px rgba(108,63,197,0.25)',
        teal:   '0 4px 16px rgba(13,148,136,0.25)',
        amber:  '0 4px 16px rgba(245,158,11,0.25)',
      },
    },
  },
  plugins: [],
}
