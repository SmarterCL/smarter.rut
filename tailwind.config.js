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
        odoo: {
          primary: '#00A09D',
          'primary-dark': '#007270',
          secondary: '#8E3537',
          'secondary-light': '#C85F63',
          gray: '#7C7C7C',
          'light-gray': '#F0F0F0',
          'dark-gray': '#4F4F4F',
          white: '#FFFFFF',
          black: '#000000',
        },
        iphone: {
          bg: '#000000',
          text: '#ffffff',
          card: '#1c1c1e',
          accent: '#00A09D', // Actualizado a color de Odoo
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