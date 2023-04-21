/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      dropShadow: {
        red: '0 35px 35px rgba(255, 186, 186, .25)',
        green: [
          '0 0px 35px rgba(223, 242, 191, .90)',
          '0 0px 65px rgba(0, 0, 0, 0.15)',
        ],
      },
      // that is animation class
      animation: {
        fade: 'fadeOut 5s ease-in-out',
      },

      // that is actual animation
      keyframes: (theme) => ({
        fadeOut: {
          '0%': { backgroundColor: theme('colors.red.300') },
          '100%': { backgroundColor: theme('colors.transparent') },
        },
      }),
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
