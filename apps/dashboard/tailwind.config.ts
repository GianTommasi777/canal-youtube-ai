import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#07090d",
        panel: "#0d1118",
        line: "#1d2633",
        acid: "#b8ff5c",
        cyan: "#5ce1ff",
      },
      boxShadow: {
        glow: "0 0 40px rgba(184, 255, 92, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
