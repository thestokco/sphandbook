import type { Config } from "tailwindcss";

/**
 * Design tokens ported from the SPHandbook.jsx prototype.
 * Colours are exposed both as Tailwind theme values and (in globals.css) as
 * CSS variables, so semantic component classes and utility classes agree.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "var(--ivory)",
        paper: "var(--paper)",
        sand: "var(--sand)",
        line: "var(--line)",
        taupe: "var(--taupe)",
        "taupe-deep": "var(--taupe-deep)",
        navy: "var(--navy)",
        "navy-soft": "var(--navy-soft)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        panel: "var(--panel)",
      },
      fontFamily: {
        // Wired to the next/font CSS variables set in app/layout.tsx.
        display: ["var(--font-newsreader)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "22px",
        panel: "18px",
        field: "14px",
      },
      boxShadow: {
        lift: "0 26px 44px -28px rgba(43,41,37,.5)",
        card: "0 30px 60px -40px rgba(43,41,37,.35)",
        book: "0 50px 90px -45px rgba(43,41,37,.6)",
      },
    },
  },
  plugins: [],
};

export default config;
