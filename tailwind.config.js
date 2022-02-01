module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        scaleKey: {
          '0%, 100%': {
            transform: 'scale(1)'
          },
          '50%': {
            transform: 'scale(1.5)',
            backgroundColor: 'rgb(148 163 184 / var(--tw-bg-opacity))'
          },
        },
      },
      animation: {
        scaler: 'scaleKey 1s ease-in-out infinite'
      },
    },
  },
  plugins: [],
}

