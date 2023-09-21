import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyfillsPlugin from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/audio-shifter',
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      // for production
      plugins: [rollupNodePolyfillsPlugin()],
    },
  },
  resolve: {
    alias: {
      // by node-globals-polyfill
      events: 'rollup-plugin-node-polyfills/polyfills/events',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true, process: true }), NodeModulesPolyfillPlugin()],
    },
  },
});
