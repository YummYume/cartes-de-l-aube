/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
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
  plugins: [],
};
