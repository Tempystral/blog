import * as fs from "node:fs";
import { globStreamSync } from "glob";
import { replaceInFile, replaceInFileSync } from "replace-in-file";

const patterns = {
	newlines: /{{<.*(\n+)?[^{}<>\n]*(\n+)?>}}/gm,
	figure:
		/{{<.*figure(?=.*src="(?<name>[^"]+)")(?=.*caption="(?<caption>[^"]+)")(?=.*alt="(?<alt>[^"]+)").*>}}/gm,
	resources: /^.*name:\s*(?<name>.*)$\n^.*src:\s*(?<src>.*)$\n/gm,
};

try {
	const blogposts = "./src/content/post/**/*.{md,mdx}";
	let resources = [];
	let results = "";

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
			resources = matches.map((m) => [m.groups.name, m.groups.src]);
			console.log("Grabbed resources: ", resources);

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

	results = await replaceInFile({
		files: blogposts,
		from: patterns.figure,
		to: (match, name, caption, alt) =>
			`<TFigure src="${name}" alt="${alt}">\n  ${caption}\n</TFigure>`,
		dry: false,
	});
	console.log("Replacement results:", results);
} catch (error) {
	console.error("Error occurred:", error);
}
