import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    server: {
        proxy: {
            // Proxy Bungee API requests to bypass CORS in development
            '/bungee-api': {
                target: 'https://backend.bungee.exchange',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/bungee-api/, ''),
                secure: true,
            },
        },
    },
});