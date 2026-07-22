/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bible-gold': '#D4AF37',
        'bible-blue': '#1E3A8A',
        'bible-purple': '#4C1D95',
        'brand-blue': '#2E6FDB',
        'brand-violet': '#7C5CFC',
        'ink': '#1B2333',
        'slate-body': '#5B6474',
        'mist': '#DCE3F0',
        'sky-tint-1': '#EAF4FB',
        'sky-tint-2': '#F1EAFB',
      },
      fontFamily: {
        'scripture': ['Georgia', 'serif'],
        'heading': ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'btn': '10px',
      },
      boxShadow: {
        'brand': '0 6px 16px -6px rgba(46,111,219,0.4)',
      },
    },
  },
  plugins: [],
}
