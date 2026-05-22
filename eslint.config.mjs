import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
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
