import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Una sola configuración para todos los paquetes.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Librería sin app: Next no debe buscar una carpeta pages.
  { settings: { next: { rootDir: ["packages/*/"] } } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/next-env.d.ts",
  ]),
]);

export default eslintConfig;
