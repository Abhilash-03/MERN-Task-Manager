/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', 'node_modules/flowbite-react/lib/esm/**/*.js'],
  
  theme: {
    extend: {
      fontFamily: {
        tf: 'Merriweather, serif'
      },
      boxShadow: {
        shd: '3px 4px 18px black',
        btnshd: '-8px -6px 5px black',
        hovershd: '8px 6px 5px black'
      },
    },
  },
  plugins: [require('flowbite/plugin'),],
};

