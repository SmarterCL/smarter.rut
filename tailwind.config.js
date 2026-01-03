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
          purple: '#875A7B', // Purple principal de Odoo
          'purple-light': '#A78AB6', // Light Purple para hover y fondos secundarios
          'purple-dark': '#5C3A5B', // Dark Purple para texto destacado
          'gray-dark': '#333333', // Dark Gray para texto principal
          'gray-medium': '#666666', // Medium Gray para texto secundario
          'gray-light': '#F7F7F7', // Light Gray para fondos y tarjetas
          green: '#78B159', // Green para éxitos
          red: '#E74C3C', // Red para errores y alertas
          yellow: '#F1C40F', // Yellow para advertencias
          white: '#FFFFFF',
          black: '#000000',
        },
        iphone: {
          bg: '#000000',
          text: '#333333', // Actualizado a color de Odoo
          card: '#F7F7F7', // Actualizado a color de Odoo
          accent: '#875A7B', // Actualizado a color de Odoo Purple
          success: '#78B159', // Actualizado a color de Odoo Green
          warning: '#F1C40F', // Actualizado a color de Odoo Yellow
          danger: '#E74C3C', // Actualizado a color de Odoo Red
        }
      },
      maxWidth: {
        'iphone': '414px',
      }
    },
  },
  plugins: [],
}