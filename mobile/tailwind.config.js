/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#F7F7F5",
          dark: "#111111",
        },
        foreground: {
          light: "#111111",
          dark: "#F5F5F5",
        },
        muted: {
          light: "#6B6B6B",
          dark: "#9A9A9A",
        },
        border: {
          light: "#222222",
          dark: "#DDDDDD",
        },
        accent: "#F5E51B",
      },
    },
  },
  plugins: [],
};
