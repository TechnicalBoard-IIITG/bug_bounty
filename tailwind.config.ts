import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          nav: "#131921",
          header: "#131921",
          subnav: "#232f3e",
          footer: "#232f3e",
          footerBottom: "#131a22",
          accent: "#febd69",
          orange: "#ffa41c",
          yellow: "#ffd814",
          yellowHover: "#f7ca00",
          searchYellow: "#febd69",
          searchYellowHover: "#f3a847",
          bg: "#eaeded",
          text: "#0f1111",
          link: "#007185",
          linkHover: "#c7511f",
          price: "#b12704",
          star: "#de7921",
          border: "#d5d9d9",
        },
      },
    },
  },
  plugins: [],
};

export default config;
