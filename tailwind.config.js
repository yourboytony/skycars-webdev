/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sky-blue': '#0EA5E9',
        'deep-blue': '#0369A1',
      }
    },
  },
  plugins: [],
}
