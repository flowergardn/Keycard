const { withAnimations } = require("animated-tailwindcss");

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["black"],
  },
  plugins: [require("daisyui")],
};

// @ts-ignore
module.exports = withAnimations(config);