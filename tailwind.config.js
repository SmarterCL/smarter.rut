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
          purple: 'var(--ui-accent-primary)', // Purple principal de Odoo
          'purple-light': '#A78AB6', // Light Purple para hover y fondos secundarios
          'purple-dark': '#5C3A5B', // Dark Purple para texto destacado
          'gray-dark': 'var(--ui-text-primary)', // Dark Gray para texto principal
          'gray-medium': 'var(--ui-text-muted)', // Medium Gray para texto secundario
          'gray-light': 'var(--ui-bg-base)', // Light Gray para fondos y tarjetas
          green: 'var(--ui-success)', // Green para éxitos
          red: '#E74C3C', // Red para errores y alertas
          yellow: 'var(--ui-warning)', // Yellow para advertencias
          orange: '#FF9800', // Naranja adicional
        },
        iphone: {
          bg: 'var(--ui-bg-base)',
          text: 'var(--ui-text-primary)', // Actualizado a color de Odoo
          card: 'var(--ui-bg-base)', // Actualizado a color de Odoo
          accent: 'var(--ui-accent-primary)', // Actualizado a color de Odoo Purple
          success: 'var(--ui-success)', // Actualizado a color de Odoo Green
          warning: 'var(--ui-warning)', // Actualizado a color de Odoo Yellow
          danger: '#E74C3C', // Actualizado a color de Odoo Red
        }
      },
      maxWidth: {
        'iphone': '414px',
        'screen-xl': '1200px',
        'screen-2xl': '1400px',
      },
      spacing: {
        '200': '200px',
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