/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './libs/**/src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  darkMode: ['class', '.p-dark'],
  plugins: [require('tailwindcss-primeui')],
};

