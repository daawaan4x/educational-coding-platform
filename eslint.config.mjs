// @ts-check

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import prettiereslint from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

export default tseslint.config(
	eslint.configs.recommended,
	...compat.extends("next/core-web-vitals", "next/typescript"),
	tseslint.configs.recommendedTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		ignores: [
			"node_modules",
			"dist",
			".next",
			"out",
			"src/components/magicui",
			"tailwind.config.ts",
			"eslint.config.mjs",
			"commitlint.config.mjs",
			".prettierrc.js",
		],
	},
	prettiereslint,
	{
		// Temporarily disable rules for frontend development only
		files: ["./src/app/**", "./src/components/**"],
		rules: {
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-unnecessary-type-assertion": "off",
			"@typescript-eslint/require-await": "off",
			"@typescript-eslint/no-floating-promises": "off",
			"no-irregular-whitespace": "off",
			"react-hooks/rules-of-hooks": "off",
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/prefer-optional-chain": "off",
			"@typescript-eslint/no-empty-function": "off",
		},
	},
	{
		rules: {
			// backend rules
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-call": "off",
		},
	},
);
// Comment out the rules before production
