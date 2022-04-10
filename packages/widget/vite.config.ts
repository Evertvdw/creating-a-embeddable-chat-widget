import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({ customElement: true })],
  server: {
    port: 4000,
  },
  build: {
    lib: {
      entry: path.resolve(
        dirname(fileURLToPath(import.meta.url)),
        'src/main.ts'
      ),
      name: 'chat-widget',
      fileName: (format) => `widget.${format}.js`,
    },
    outDir: '../dist/widget',
    emptyOutDir: true,
  },
});
