/** @type {import("prettier").Config} */
export default {
	printWidth: 100,
	semi: true,
	singleQuote: false,
	tabWidth: 2,
	useTabs: true,
	bracketSameLine: true,
	plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss" /* Must come last */],
	overrides: [
		{
			files: "**/*.astro",
			options: {
				parser: "astro",
				htmlWhitespaceSensitivity: "strict",
				bracketSameLine: true,
			},
		},
		{
			files: ["*.mdx", "*.md"],
			options: {
				printWidth: 80,
			},
		},
	],
};
