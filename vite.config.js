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
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || `http://127.0.0.1:${process.env.BACKEND_PORT || 8081}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    assetsDir: 'react',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router/') ||
            id.includes('node_modules/react-router-dom/') ||
            id.includes('node_modules/@reduxjs/') ||
            id.includes('node_modules/react-redux/') ||
            id.includes('node_modules/jotai/')
          ) {
            return 'vendor-react-core';
          }
          if (
            id.includes('node_modules/antd/') ||
            id.includes('node_modules/@ant-design/') ||
            id.includes('node_modules/rc-')
          ) {
            return 'vendor-antd';
          }
          if (
            id.includes('node_modules/@tiptap/') ||
            id.includes('node_modules/prosemirror-')
          ) {
            return 'vendor-tiptap';
          }
          if (id.includes('node_modules/recharts/')) {
            return 'vendor-recharts';
          }
          if (
            id.includes('node_modules/@monaco-editor/') ||
            id.includes('node_modules/monaco-editor/')
          ) {
            return 'vendor-monaco';
          }
          if (id.includes('node_modules/grapesjs')) {
            return 'vendor-grapesjs';
          }
          if (id.includes('node_modules/@headlessui/')) {
            return 'vendor-headlessui';
          }
          if (
            id.includes('node_modules/dayjs/') ||
            id.includes('node_modules/lodash/') ||
            id.includes('node_modules/axios/')
          ) {
            return 'vendor-utils';
          }
        },
      },
    },
  },
});
