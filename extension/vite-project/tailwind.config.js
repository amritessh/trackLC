module.exports = {
  content:[
    "./index.html",
    "./src/**/*/*.{js,jsx,ts,tsx}",
  ],
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors:{
        primary:{
          light:'#4da3ff',
          DEFAULT: '#2f80ed',
          dark:'#1a56a0',
        },
        leetcode:{
          easy: '#00af9b',
          medium: '#ffb800',
          hard: '#ff2d55',
        }
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
