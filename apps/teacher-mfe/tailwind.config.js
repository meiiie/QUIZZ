/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      height: {
        '15': '60px',
      },
      margin: {
        '15': '60px',
      },
      spacing: {
        '15': '60px',
      },
      zIndex: {
        '999': '999',
        '1000': '1000',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
