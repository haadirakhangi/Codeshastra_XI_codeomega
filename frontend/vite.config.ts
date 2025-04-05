import { defineConfig, UserConfig, ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default ({ command }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build';

  return defineConfig({
    plugins: [react(), tailwindcss()],
    define: {
      global: {}
    },
    build: {
      target: 'esnext',
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5000', // ✅ Use correct target
          changeOrigin: true,
          secure: false, // ✅ If using HTTPS locally, set this to false
          rewrite: (path) => path.replace(/^\/api/, ""), // ✅ Ensure /api is removed properly
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@airgap/beacon-types': path.resolve(
          path.resolve(),
          `./node_modules/@airgap/beacon-types/dist/${
            isBuild ? 'esm' : 'cjs'
          }/index.js`
        ),
        // polyfills
        'readable-stream': 'vite-compatible-readable-stream',
        stream: 'vite-compatible-readable-stream'
      }
  }
});
};