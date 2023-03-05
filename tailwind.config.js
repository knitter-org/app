/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    require('@tailwindcss/line-clamp'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#5AB1BB",
          secondary: "#A5C882",
          accent: "#F7DD72",
          neutral: "#393D3F",
          "base-100": "#1B2021",
          info: "#47A2CD",
          success: "#135E34",
          warning: "#EBA23D",
          error: "#FF7F11",
        },
      },
    ],
  },
};
