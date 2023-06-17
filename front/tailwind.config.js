/* eslint-disable global-require */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1D1E22',
        surface: '#333540',
        accent: '#FF3366',
        secondary: '#0077CC',
        success: '#009933',
        warning: '#FF3300',
        tertiary: '#D1A615',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/forms')],
};
