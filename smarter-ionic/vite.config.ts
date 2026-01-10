import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import replace from '@rollup/plugin-replace';
import { fixIonicImports } from './plugins/fix-ionic-imports.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    }),
    fixIonicImports(),
  ],
  server: {
    port: 3001,
    open: true,
  },
  build: {
    outDir: 'www',
  },
  define: {
    global: 'globalThis',
  },
  envPrefix: ['VITE_', 'MCP_'], // Asegurar que las variables MCP estén disponibles en el cliente
});