import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: {
    bg:{base:"#0c0c14",panel:"#111120",card:"#16162a",hover:"#1c1c32",border:"rgba(255,255,255,0.07)"},
    brand:{blue:"#3a7bff",violet:"#9b5de5",teal:"#00d4aa"},
    ink:{bright:"#eeeeff",mid:"#9898c8",muted:"#4a4a7a"},
  }}},
  plugins: [],
};
export default config;