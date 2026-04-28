/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edfbfa',
          100: '#d3f4f2',
          200: '#a8e7e2',
          300: '#77d4cd',
          400: '#3cb6ae',
          500: '#1b9b93',
          600: '#137c76',
          700: '#126460',
          800: '#12504d',
          900: '#114341',
        },
        surface: {
          DEFAULT: '#ffffff',
          2: '#f7fafb',
          3: '#eff5f6',
        },
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
        card: '0 10px 25px rgba(2, 6, 23, 0.06)',
      },
    },
  },
  plugins: [],
}

