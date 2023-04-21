/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(256, 0, 0, 0.3)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#C9C9C9',
          secondary: '#7fe0c8',
          accent: '#db7fb7',
          neutral: '#252E41',
          'base-100': '#ffffff',
          info: '#519CD2',
          success: '#27A599',
          warning: '#FAAA1E',
          error: '#F93448',
        },
      },
    ],
  },
};
