import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1F3D2B", // Vert forêt
          soft: "#3A6B4F",    // Vert doux
        },
        leather: {
          DEFAULT: "#7A5C3E", // Brun cuir
          light: "#E8E1D6",   // Brun clair / sable
        },
        neutral: {
          offwhite: "#FAFAF8",
          stone: "#E5E7EB",
          charcoal: "#1F2937",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
