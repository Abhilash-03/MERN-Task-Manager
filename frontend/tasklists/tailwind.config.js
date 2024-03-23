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
      },
    },
  },
  plugins: [require('flowbite/plugin'),],
};

