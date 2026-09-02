/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#070B12",
        panel: "#0D1421",
        line: "rgba(255,255,255,0.10)"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(56, 189, 248, 0.18)"
      }
    }
  },
  plugins: []
};
