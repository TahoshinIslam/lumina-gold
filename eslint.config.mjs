import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Vendored UI, copied in from animate-ui / shadcn and not maintained here.
    // Linting code we do not write means CI is red for other people's style
    // choices, and a red build that is always red tells you nothing.
    "src/components/animate-ui/**",
    "src/components/ui/**",
    "src/hooks/use-mobile.ts",
    "src/hooks/use-controlled-state.tsx",
  ]),
]);

export default eslintConfig;
