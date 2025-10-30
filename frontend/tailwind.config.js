/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E44232', // Todoist-ish red
          dark: '#C0362A',
        },
      },
    },
  },
  plugins: [],
};
