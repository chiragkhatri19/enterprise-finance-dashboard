import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  // Performance optimizations
  build: {
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Generate sourcemaps for production builds
    sourcemap: mode === 'development',
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split vendor chunks for better caching
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('recharts')) {
              return 'ui-vendor';
            }
            if (id.includes('zustand') || id.includes('tanstack')) {
              return 'state-vendor';
            }
            if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'utils-vendor';
            }
          }
        }
      }
    },
    // Minify output
    minify: 'esbuild',
    // Target modern browsers
    target: 'esnext'
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'zustand',
      '@tanstack/react-query',
      'lucide-react',
      'recharts',
      'date-fns',
      'clsx',
      'tailwind-merge'
    ]
  },
  // CSS optimization
  css: {
    devSourcemap: mode === 'development',
  }
}));
