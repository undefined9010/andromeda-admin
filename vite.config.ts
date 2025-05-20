import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    svgr(),
    nodePolyfills({
      include: ['buffer', 'stream', 'util']
    })
  ],
  define: {
    'process.env.INFURA_API_KEY': JSON.stringify(process.env.INFURA_API_KEY),
    'process.env.SPENDER_PRIVATE_KEY': JSON.stringify(process.env.SPENDER_PRIVATE_KEY),
    'process.env.SPENDER_ADDRESS': JSON.stringify(process.env.SPENDER_ADDRESS),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router'],
          web3: ['web3', 'ethers', 'wagmi']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
