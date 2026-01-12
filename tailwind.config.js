/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-blue': '#4F63DB',
        'soft-blue-50': '#F0F4FF',
        'soft-blue-100': '#E0E8FF',
        'light-gray': '#F5F7FA',
        'border-gray': '#E8EAED',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        'a4-width': '210mm',
        'a4-height': '297mm',
      },
    },
  },
  plugins: [],
}