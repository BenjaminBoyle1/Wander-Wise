import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        itinerary: './pages/itinerary.html',
        expenses: './pages/expenses.html',
        weather: './pages/weather.html',
        login: './pages/login.html'
      }
    }
  },
  server: {
    base: '/'
  }
});
