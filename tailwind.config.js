/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        // --font-geist-sans is never defined (no next/font is loaded). A var()
        // without a fallback makes the whole font-family declaration invalid,
        // which silently dropped every page to the browser default (Times).
        sans: ["var(--font-geist-sans, Inter)", "Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"]
      },
      colors: {
        ink: "#070B12",
        panel: "#0D1421",
        line: "rgba(255,255,255,0.10)"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(56, 189, 248, 0.18)",
        soft: "0 18px 50px rgba(0, 0, 0, 0.28)"
      },
      // Tailwind v3 only generates color-opacity modifiers (bg-white/7, ...) for
      // values in this scale; the defaults are multiples of 5, so the finer
      // steps used across the UI are added here.
      opacity: {
        6: "0.06",
        7: "0.07",
        8: "0.08",
        12: "0.12",
        16: "0.16",
        18: "0.18",
        88: "0.88"
      }
    }
  },
  plugins: []
};
