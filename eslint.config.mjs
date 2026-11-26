import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [".next/**", "out/**", "node_modules/**"]
  },
  ...compat.extends("next/core-web-vitals"),
  {
    // Flat config only picks up *.js/*.mjs/*.cjs by default; without this
    // entry every .jsx component was silently skipped by the linter.
    files: ["**/*.{js,jsx,mjs,cjs}"],
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off"
    }
  }
];

export default eslintConfig;
