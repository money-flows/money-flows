import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3959CC",
          darken: "#263F94",
        },
        accent: {
          DEFAULT: "#DA3170",
          darken: "#A33961",
        },
        alert: {
          DEFAULT: "#DB3939",
          darken: "#B02B2B",
        },
        text: {
          main: "#2E3035",
          sub: "#6A6C70",
          white: "#FFFFFF",
          disabled: "#D5D5D7",
          placeholder: "#909194",
          link: {
            DEFAULT: "#3959CC",
            sub: "#6A6C70",
          },
        },
        background: {
          primary: {
            DEFAULT: "#F2F6FD",
            darken: "#CBD3F2",
          },
          accent: {
            DEFAULT: "#FDF2F9",
            darken: "#F8CFDE",
          },
          gray: "#F6F6F6",
          white: "#FFFFFF",
          modal: "7F7F7F",
          alert: "#FCF4F4",
        },
        border: "#D5D5D7",
        overlay: "#CCCCCC",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
