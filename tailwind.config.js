// tailwind.config.js
module.exports = {
  content: ["{pages,app}/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50: "#c3ea73",
          100: "#b9e069",
          200: "#afd65f",
          300: "#a5cc55",
          400: "#9bc24b",
          500: "#91b841",
          600: "#87ae37",
          700: "#7da42d",
          800: "#739a23",
          900: "#699019",
        },
        blue: {
          50: "#565779",
          100: "#4c4d6f",
          200: "#424365",
          300: "#38395b",
          400: "#2e2f51",
          500: "#242547",
          600: "#1a1b3d",
          700: "#101133",
          800: "#060729",
          900: "#00001f",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
