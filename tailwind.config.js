/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure this line is present and correct
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui") // Add DaisyUI plugin
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          "primary": "#90EE90", // Light Green
          "primary-content": "#000000", // Black
          "base-100": "#FFFFFF",
          "base-200": "#F0F0F0",
        },
      },
      "dark",
    ],
  },
}