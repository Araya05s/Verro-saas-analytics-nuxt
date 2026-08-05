// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          innerHTML: `
            (function() {
              try {
                var theme = localStorage.getItem('theme_mode') || 'system';
                var accent = localStorage.getItem('accent_color') || 'green';
                var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-accent', accent);
              } catch (e) {}
            })();
          `
        }
      ]
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {    plugins: [      tailwindcss(),    ],  },
  modules: ['@nuxt/icon', '@nuxt/eslint', '@pinia/nuxt'],
  nitro: {
    preset: 'static'
  },
})