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
        'navbar-width': 'auto',
      },
      width: {
        'navbar-height': '57px'
      },
      colors: {
        'navbar-color': '#f8f8f81a',
      },
      borderRadius: {
        'large': '53px',
      },
      margin: {
        'popup': '550px'
      },
      fontFamily: {
        'auth-display': 'Montserrat, sans-serif',
      }
    },
  },
  plugins: [],
}