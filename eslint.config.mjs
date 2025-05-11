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
);
