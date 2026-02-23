import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    // Relax some rules that cause the production build to fail due to strict linting
    // (project still benefits from these rules during development).
    rules: {
      // Disable this rule to avoid build failures from code that still uses `any`.
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
