import * as fs from "node:fs";
import { globStreamSync } from "glob";
import { replaceInFile, replaceInFileSync } from "replace-in-file";

const patterns = {
	newlines: /{{<.*(\n+)?[^{}<>\n]*(\n+)?>}}/gm,
	figureName: /{{<.*figure.*src="(?<name>[^"]+)"(.*)>}}/gm,
	figureCaption: /<Figure(.*)caption="(?<caption>[^"]+)"(.*)>/gm,
	figureAlt: /<Figure(.*)alt="(?<alt>[^"]+)"(.*)>/gm,
	resources: /^.*name:\s*(?<name>.*)$\n^.*src:\s*(?<src>.*)$\n/gm,
	allResources: /\nresources:(?:\n(.+(name|src): .+\n)+)/gm,
	featuredImage: /featuredImage:\s?(?:(?<img>.+)\n)?/gm,
};

try {
	const blogposts = "./src/content/post/**/*.{md,mdx}";
	const resources = [];
	let results = "";

	// Replace newlines in figures to make matching nicer
	results = await replaceInFile({
		files: blogposts,
		from: patterns.newlines,
		to: (match, capture) => match.replaceAll(capture, ""),
		dry: false,
	});
	console.log("Replacement results:", results);

	const posts = globStreamSync(blogposts);
	posts.on("data", async (path) => {
		console.log(`Loaded ${path}`);
		const file = fs.readFileSync(path, { encoding: "utf-8" });
		const matches = Array.from(file.matchAll(patterns.resources));
		if (matches.length) {
			matches.forEach((m) => resources.push([m.groups.name, m.groups.src]));
			console.log("Grabbed resources: ", resources);

			// Replace figure name=etc with figure src=etc
			results = replaceInFileSync({
				files: path,
				dry: false,
				from: resources.map((r) => new RegExp(`name="${r[0]}"`, "g")),
				to: resources.map((r) => `src="${r[1]}"`),
				// Change name to src
			});
			console.log("Replacement results:", results);
		}
	});

	// Remove resources
	results = await replaceInFile({
		files: blogposts,
		from: patterns.allResources,
		to: (match) => "",
		dry: false,
	});

	// Replace featuredImage with coverImage
	results = await replaceInFile({
		files: blogposts,
		from: patterns.featuredImage,
		to: (match, img) => `coverImage:\n  src: ${img}\n  alt: ""`,
		dry: false,
	});

	// Replace figure shortcodes with preliminary tag, change name to src
	results = await replaceInFile({
		files: blogposts,
		from: patterns.figureName,
		to: (match, name, other) => `<Figure src="${name}"${other}>\n</Figure>`,
		dry: false,
	});

	// Isolate the captions and move them around
	results = await replaceInFile({
		files: blogposts,
		from: patterns.figureCaption,
		to: (match, before, caption, after) =>
			`<Figure ${before.trim()}${after.trim()}>\n${caption}`,
		dry: false,
	});

	console.log("Replacement results:", results);
} catch (error) {
	console.error("Error occurred:", error);
}
