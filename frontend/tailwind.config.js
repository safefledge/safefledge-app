/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'hero-xxxl': '583px',
        'search-xxl': '160px',
        'search-xxl-smDevice': '400px',
        'search-button': '37px',
        'date-picker': '100px',
        'footer-height': '431px'
      },
      width: {
        'hero-text': '512px',
        'search-xxl': '1000px',
        'search-xxl-smDevice': '400px',
        'input-width': '163px',
        'search-button': '131px',
        'date-picker': '480px',
        'footer-width': '100%',
        'footer-logo': '300px',
      },
      colors: {
        'primary': '#0072C6',
      },
      borderRadius: {
        'large': '53px',
      },
      margin: {
        'popup': '550px'
      }
    },
  },
  plugins: [],
}