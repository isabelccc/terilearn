/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#edf0f0',
          secondary: '#cfdddb',
          accent: '#c8a2d6',
          muted: '#e9e9e9',
          customGray: {
            100: '#F3F4F6',
            200: '#E5E7EB',
            900: '#111827',
          },
        },
      },
    },
    plugins: [],
  }