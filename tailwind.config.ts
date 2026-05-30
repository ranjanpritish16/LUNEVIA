import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "var(--gold)",
        cream: "var(--cream)",
        blush: "var(--blush)",
        rose: "var(--rose)",
        primary: "var(--primary)",
        charcoal: "var(--charcoal)",
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "serif"],
        "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
      },
      boxShadow: {
        warm: "0 4px 24px rgba(201, 147, 58, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
