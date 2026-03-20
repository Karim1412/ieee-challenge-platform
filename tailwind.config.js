/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Orbitron"', 'monospace'],
        body: ['"Exo 2"', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      colors: {
        void: '#04050a',
        cosmos: '#080d1a',
        nebula: '#0d1528',
        ion: '#00d4ff',
        plasma: '#7b2fff',
        pulse: '#ff2d7e',
        nova: '#00ff9d',
        star: '#ffd700',
        ash: '#1a2035',
        mist: '#2a3550',
        ghost: '#8899bb',
      },
      boxShadow: {
        ion: '0 0 20px rgba(0, 212, 255, 0.4), 0 0 60px rgba(0, 212, 255, 0.1)',
        plasma: '0 0 20px rgba(123, 47, 255, 0.4), 0 0 60px rgba(123, 47, 255, 0.1)',
        pulse: '0 0 20px rgba(255, 45, 126, 0.4), 0 0 60px rgba(255, 45, 126, 0.1)',
        nova: '0 0 20px rgba(0, 255, 157, 0.4), 0 0 60px rgba(0, 255, 157, 0.1)',
        star: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.15)',
        card: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 212, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.3)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'grid': 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
        'radial-ion': 'radial-gradient(ellipse at center, rgba(0,212,255,0.15) 0%, transparent 70%)',
        'radial-plasma': 'radial-gradient(ellipse at center, rgba(123,47,255,0.15) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
