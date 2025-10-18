/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          accent: "#D1FE17",
          main: "#000000",
          additional: "#F7F7F8",
        },
        background: "#000000",
        foreground: "#F7F7F8",
      },
      borderRadius: { xl: "1rem", "2xl": "1.5rem" },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,0.25)",
        glow: "0 0 16px rgba(209,254,23,0.55)",
      },
    },
  },
  plugins: [],
};
