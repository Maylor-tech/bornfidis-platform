/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bf-green': '#013220',
        'bf-gold': '#D4AF37',
        'bf-black': '#000000',
        'coral': '#CE673E',
        'coral-dark': '#B85A2E',
        'sage': '#87A96B',
        'bornfidis-green': '#0A3D2F',
        'bornfidis-gold': '#D4AF37',
        'bornfidis-black': '#1A1A1A',
        'bornfidis-cream': '#FAF8F2',
        'bornfidis-sage': '#E7EFE5',
      },
      fontFamily: {
        'body': ['var(--font-montserrat)', 'sans-serif'],
        'headline': ['var(--font-abril)', 'serif'],
      },
    },
  },
  plugins: [],
}

