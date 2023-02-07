/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        Primary: "#1199FA",
        PrimaryDark: "#0F1C39",
        PrimaryDisable: "#1e3f6f",
        Background: "#0B1426",
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
