import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("@kawalcovid19/tailwind-preset-wbw")],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
