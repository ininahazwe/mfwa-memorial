/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fond sombre
        deep: '#0a0a0a',
        card: '#141414',
        
        // Textes
        primary: '#f5f5f0',
        muted: '#8a8a85',
        
        // Accent doré (mémoriel)
        accent: '#c4a77d',
        'accent-dim': 'rgba(196, 167, 125, 0.15)',
        
        // Bordures subtiles
        border: 'rgba(255, 255, 255, 0.06)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
