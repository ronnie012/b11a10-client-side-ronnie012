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
  daisyui: { // DaisyUI configuration
    themes: ["light", "dark", "night", "black", "bumblebee", "emerald", "cyberpunk", "valentine", "halloween", "garden", "fantasy",  "luxury",  ], // You can add more themes later
    logs: true, // Enable DaisyUI logs for debugging during setup
  },
}