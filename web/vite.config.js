import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const API_PROXY_TARGET = process.env.VITE_API_PROXY_TARGET || 'http://localhost:9090';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'),
    },
    extensions: ['.js', '.ts', '.svelte', '.svelte.ts'],
    conditions: ['browser'],
  },
  optimizeDeps: {
    exclude: ['@yume-chan/libde265'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/chart.js')) {
            return 'vendor-chart';
          }
          if (id.includes('node_modules/svelte')) {
            return 'vendor-svelte';
          }
          if (id.includes('node_modules/hls.js')) {
            return 'vendor-hls';
          }
          if (id.includes('node_modules/lucide-svelte')) {
            return 'vendor-lucide';
          }
          if (id.includes('node_modules/onnxruntime-web')) {
            return 'vendor-onnx';
          }
          if (id.includes('node_modules/@yume-chan/libde265')) {
            return 'vendor-libde265';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: '127.0.0.1',
      clientPort: 5173,
    },
    proxy: {
      // 开发模式下把后端 API、SSE、WebSocket 流量代理到本地 Go 服务。
      '/api': {
        target: API_PROXY_TARGET,
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
  },
});
