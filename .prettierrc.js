/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig*/
/** @typedef  {import("prettier").Config} PrettierConfig*/

/** @type { PrettierConfig | SortImportsConfig } */
const config = {
	arrowParens: "always",
	bracketSameLine: true,
	bracketSpacing: true,
	embeddedLanguageFormatting: "auto",
	htmlWhitespaceSensitivity: "css",
	importOrder: ["___", "__", "<THIRD_PARTY_MODULES>", "^[./]"],
	jsxSingleQuote: false,
	printWidth: 120,
	proseWrap: "preserve",
	quoteProps: "consistent",
	semi: true,
	useTabs: true,
	trailingComma: "all",
	vueIndentScriptAndStyle: true,
	tabWidth: 2,
	singleQuote: false,
	plugins: [require.resolve("@ianvs/prettier-plugin-sort-imports"), "prettier-plugin-tailwindcss"],
};

module.exports = config;
