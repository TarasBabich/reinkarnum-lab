import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: { display: ["Georgia", "Times New Roman", "serif"] },
      boxShadow: { gold: "0 0 30px rgba(224,194,118,.18)", cyan: "0 0 30px rgba(100,220,255,.15)" },
      colors: { reincarnum: { gold: "#e0c276", ink: "#030706", moss: "#10251f" } }
    },
  },
  plugins: [],
};

export default config;
