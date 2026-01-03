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
          blue: '#1E88E5', // Azul adicional
          orange: '#FF9800', // Naranja adicional
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
        'screen-xl': '1200px',
        'screen-2xl': '1400px',
      },
      spacing: {
        '240': '240px',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'btn': '0 4px 12px rgba(135, 90, 123, 0.3)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
}