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
      },
      fontFamily: {
        'scripture': ['Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}