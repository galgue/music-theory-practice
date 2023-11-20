/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      keyframes: {
        "right-answer": {
          "0%, 100%": { fill: "white", stroke: "white" },
          "50%": { fill: "green", stroke: "green" },
        },
        "wrong-answer": {
          "0%, 100%": { fill: "white", stroke: "white" },
          "50%": { fill: "red", stroke: "red" },
        },
      },
    },
  },
  plugins: [],
};
