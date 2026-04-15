import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [react()],
      root: 'dev',
    };
  }

  return {
    plugins: [react(), dts({ insertTypesEntry: true })],
    build: {
      cssCodeSplit: false,
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'CmsLibrary',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime', 'framer-motion'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'ReactJsxRuntime',
            'framer-motion': 'framer-motion',
          },
        },
      },
    },
  };
});
