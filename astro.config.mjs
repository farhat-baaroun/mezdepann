import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
      cssCodeSplit: true,
      minify: 'esbuild',
      target: 'es2020',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // React core libraries
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }
            // UI libraries (if any added later)
            if (id.includes('node_modules/lucide-react')) {
              return 'ui-vendor';
            }
            // Individual React components
            if (id.includes('/components/react/')) {
              const componentName = id.split('/components/react/')[1]?.split('.')[0];
              return `component-${componentName}`;
            }
          },
        },
      },
    },
    esbuild: {
      legalComments: 'none',
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
    },
    optimizeDeps: {
      exclude: [],
      include: ['react', 'react-dom'],
    },
  },
  compressHTML: true,
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
  },
});

