import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import security from "eslint-plugin-security";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  security.configs.recommended,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off", // Global disable
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Serwist generated service worker
    "public/sw.js", // Add this line
  ]),
  {
    files: ["app/_components/agenda/RoleDisplay.tsx"],
    rules: {
      "react/no-unescaped-entities": "off", // Disable for this file
    },
  },
  { // NEW OVERRIDE
    files: ["app/_components/timer/TimerReport.tsx"],
    rules: {
      "react/no-unescaped-entities": "off", // Disable for this file
    },
  },
]);

export default eslintConfig;
