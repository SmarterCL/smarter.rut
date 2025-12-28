/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        iphone: {
          bg: '#000000',
          text: '#ffffff',
          card: '#1c1c1e',
          accent: '#0a84ff',
          success: '#30d158',
          warning: '#ffd60a',
          danger: '#ff453a',
        }
      },
      maxWidth: {
        'iphone': '414px',
      }
    },
  },
  plugins: [],
}