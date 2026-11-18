/** @type {import('tailwindcss').Config} */
module.exports = {
  // Aponta para o App e para todos os componentes dentro de src
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};