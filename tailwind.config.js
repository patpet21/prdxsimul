/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",      // Root files
    "./components/**/*.{js,ts,jsx,tsx}", // Components folder
    "./pages/**/*.{js,ts,jsx,tsx}",      // Pages folder
    "./steps/**/*.{js,ts,jsx,tsx}",      // Steps folder
    "./src/**/*.{js,ts,jsx,tsx}"         // Src fallback just in case
  ],
  safelist: [
    // Force inclusion of dynamic color classes used in ProjectCard and elsewhere
    {
      pattern: /(bg|text|border)-(brand|indigo|emerald|slate|rose|purple|amber|blue|green|red|orange|cyan|violet|fuchsia)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['hover', 'group-hover', 'focus', 'active'],
    },
    'from-blue-600', 'via-indigo-600', 'to-indigo-800',
    'from-emerald-500', 'via-teal-600', 'to-cyan-700',
    'from-rose-500', 'via-pink-600', 'to-purple-700',
    'from-amber-500', 'via-orange-600', 'to-red-700',
    'from-slate-600', 'via-slate-700', 'to-slate-900',
    'from-violet-500', 'via-purple-600', 'to-fuchsia-700',
    'from-brand-500', 'to-emerald-500'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(14, 165, 233, 0.3)',
      }
    },
  },
  plugins: [],
}