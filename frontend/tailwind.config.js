module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Rubik', 'sans-serif']
    },
    extend: {
      colors: {
        'primary': {
          '50': '#fef3f5',
          '100': '#fce8eb',
          '200': '#f8c5cc',
          '300': '#f3a3ad',
          '400': '#eb5d70',
          '500': '#e21833',
          '600': '#cb162e',
          '700': '#aa1226',
          '800': '#880e1f',
          '900': '#6f0c19'
        }
      }
    },
  },
  plugins: [],
}
