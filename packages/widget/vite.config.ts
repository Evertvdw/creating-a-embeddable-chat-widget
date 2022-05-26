import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ customElement: true, template: { transformAssetUrls } }),
    quasar(),
  ],
  server: {
    port: 4000,
    open: true,
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
    outDir: '../../dist/widget',
    emptyOutDir: true,
  },
});
