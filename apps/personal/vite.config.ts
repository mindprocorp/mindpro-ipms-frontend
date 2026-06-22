import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    svgr({
      svgrOptions: {
        icon: true,
        replaceAttrValues: {
          '#09121F': 'currentColor',
          '#394651': 'currentColor',
        },
      },
    }),
    tsconfigPaths(),
    tailwindcss(), // 👈 Tailwind v4 공식 Vite 플러그인
  ],
})
