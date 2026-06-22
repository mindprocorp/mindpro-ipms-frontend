import js from "@eslint/js";
// import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  globalIgnores(["**/dist/**", "**/node_modules/**"]),

  // 공통 JS/TS/React 기본
  {
    files: ["apps/**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      // globals: globals.browser,
      parser: tseslint.parser,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "react-refresh/only-export-components": "off",

      // axios 제한(네가 루트에 넣어둔 규칙)
      "no-restricted-imports": [
        "error",
        {
          paths: [{ name: "axios", message: "axios는 @repo/api 패키지를 통해서만 사용하세요." }],
        },
      ],
    },
  },
]);
