import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    svgr({
      svgrOptions: {
        icon: true,
        replaceAttrValues: {
          "#09121F": "currentColor",
          "#394651": "currentColor",
        },
      },
    }),
    tailwindcss(), // 👈 Tailwind v4 공식 Vite 플러그인
  ],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "src/shared"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@widgets": path.resolve(__dirname, "src/widgets"),
      "@features": path.resolve(__dirname, "src/features"),
      "@entities": path.resolve(__dirname, "src/entities"),
    },
  },
  server: {
    port: 3000, // 원하는 포트
    strictPort: true, // 이미 사용 중이면 다른 포트로 안 튐
  },
});
