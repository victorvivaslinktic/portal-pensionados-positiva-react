import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    ignores: ["node_modules", ".next", "dist", "build", "next-env.d.ts"],
  },

  // ✅ Reglas base de JavaScript
  js.configs.recommended,

  // ✅ Reglas base de TypeScript (soporte parser incluido)
  ...tseslint.configs.recommended,

  // ✅ Reglas de Next.js (Core Web Vitals)
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  // ✅ Reglas de Prettier (integrado en ESLint)
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
];
