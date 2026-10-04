import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      '@docuninja/builder2.0': path.resolve(__dirname, './src/_builder/docuninja-stub.ts'),
      'react-multi-email': path.resolve(__dirname, './src/_builder/react-multi-email-stub.tsx'),
      'localized-address-format': path.resolve(__dirname, './src/_builder/localized-address-format-stub.ts'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    assetsDir: 'react',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
          }
        },
      },
    },
  },
});
