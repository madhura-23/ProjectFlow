import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          base:   '#0c0c14',
          panel:  '#111120',
          card:   '#16162a',
          hover:  '#1c1c32',
          border: 'rgba(255,255,255,0.07)',
        },
        brand: {
          blue:   '#3a7bff',
          violet: '#9b5de5',
          teal:   '#00d4aa',
        },
        ink: {
          bright: '#eeeeff',
          mid:    '#9898c8',
          muted:  '#4a4a7a',
        },
        status: {
          todo:       '#4a4a7a',
          inprogress: '#3a7bff',
          review:     '#f7c948',
          done:       '#00d4aa',
        },
        priority: {
          urgent: '#ff6b6b',
          high:   '#f7c948',
          medium: '#3a7bff',
          low:    '#4a4a7a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}
export default config
