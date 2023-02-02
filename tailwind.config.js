/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        defaultButtongBg: "rgba(37, 157, 168, 0.08)",
      },
      fontFamily: {
        poppins: ["Poppins"],
      },
    },
  },
  plugins: [],
};
