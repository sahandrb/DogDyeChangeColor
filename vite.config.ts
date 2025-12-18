import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // لود کردن متغیرها از فایل های env محلی
    const env = loadEnv(mode, process.cwd(), '');
    
    // گرفتن متغیر از سیستم (برای کلودفلر) یا از فایل (برای لوکال)
    const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // این خط باعث میشه کلید در زمان بیلد در کد جاگذاری بشه
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
