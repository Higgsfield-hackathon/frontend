/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          main: "#000000",
          additional: "#f7f7f8",
          accent: "#d1fe17",
        },
      },
      boxShadow: {
        glow: "0 0 24px rgba(209,254,23,0.35)",
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
