// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  output: 'server', // ✅ Adiciona suporte a rotas de API

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});
