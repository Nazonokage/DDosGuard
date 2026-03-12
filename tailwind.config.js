/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1a1a2e',
        'dark-card': '#1e293b',
        'dark-border': '#334155',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(10px)' },
          '50%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(10px)' },
        }
      }
    },
  },
  plugins: [],
}

