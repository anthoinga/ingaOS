import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        logo: ['Monofett', 'sans-serif'],
        code: ['Fira Code', 'monospace'],
        mono: ['Fira Mono', 'monospace'],
        body: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
