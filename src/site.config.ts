import type { SiteConfig } from "@/types";
import type { AstroExpressiveCodeOptions } from "astro-expressive-code";

export const siteConfig: SiteConfig = {
	// Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
	author: "Tempystral",
	// Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
	date: {
		locale: "en-CA",
		options: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
	// Used as the default description meta property and webmanifest description
	description: "A blog!",
	// HTML lang property, found in src/layouts/Base.astro L:18 & astro.config.ts L:48
	lang: "en-CA",
	// Meta property, found in src/components/BaseHead.astro L:42
	ogLocale: "en_CA",
	// Used to construct the meta title property found in src/components/BaseHead.astro L:11, and webmanifest name found in astro.config.ts L:42
	title: "Eye of the Storm",
};

// Used to generate links in both the Header & Footer.
export const menuLinks: { path: string; title: string }[] = [
	{
		path: "/",
		title: "Home",
	},
	{
		path: "/about/",
		title: "About",
	},
	{
		path: "/posts/",
		title: "Blog",
	},
	{
		path: "/notes/",
		title: "Notes",
	},
];

// TODO: Something like this for more easily adding custom colour splashes.
// Set up tailwind theme, then assign these to the new themed vars
// Probably don't need the theme options here if they're set up correctly for dark/light in tailwind
/* const colors: {light: string, dark: string} = {
	blue: {light: "bg-sky-800"},
	amber: {light: "bg-amber-400"},
	red: {light: "bg-accent"},
	"accent-2": {light: "bg-accent-2"},
	gray: {light: "bg-slate-500"},
}; */

// https://expressive-code.com/reference/configuration/
export const expressiveCodeOptions: AstroExpressiveCodeOptions = {
	// One dark, one light theme => https://expressive-code.com/guides/themes/#available-themes
	themes: ["dark-plus", "github-light"],
	useThemedScrollbars: false,
	styleOverrides: {
		borderRadius: "4px",
		codeFontFamily:
			'"Cascadia Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;',
		codeFontSize: "0.875rem",
		codeLineHeight: "1.7142857rem",
		codePaddingInline: "1rem",
		frames: {
			frameBoxShadowCssValue: "none",
		},
		uiLineHeight: "inherit",
	},
	themeCssSelector(theme, { styleVariants }) {
		// If one dark and one light theme are available
		// generate theme CSS selectors compatible with cactus-theme dark mode switch
		if (styleVariants.length >= 2) {
			const baseTheme = styleVariants[0]?.theme;
			const altTheme = styleVariants.find((v) => v.theme.type !== baseTheme?.type)?.theme;
			if (theme === baseTheme || theme === altTheme) return `[data-theme='${theme.type}']`;
		}
		// return default selector
		return `[data-theme="${theme.name}"]`;
	},
};
