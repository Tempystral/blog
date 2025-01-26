import * as fs from "node:fs";
import { globStreamSync } from "glob";

const RED = "\u001b[31;40m";
const BLUE = "\u001b[34;40m";
const WHITE = "\u001b[37;40m";
const HL = "\u001b[34;16;16;16m";
const PINK = "\u001b[38;5;201m";
const LAVENDER = "\u001b[38;5;147m";
const AQUA = "\u001b[38;2;145;231;255m";
const PENCIL = "\u001b[38;2;253;182;0m";
const OFF = "\u001b[0m";

const posts = globStreamSync("src/content/post/**/*.{md,mdx}");

const patterns = {
	figure:
		/{{<.*figure(?=.*name="(?<name>[^"]+)")(?=.*caption="(?<caption>[^"]+)")(?=.*alt="(?<alt>[^"]+)").*>}}/g,
};

const figure = (name, alt, caption) =>
	`<TFigure name="${name}" alt="${alt}">\n  ${caption}\n</TFigure>`;

const figurePrint = (name, alt, caption) =>
	`<TFigure name="${HL}${name}${OFF}" alt="${HL}${alt}${OFF}">\n  ${HL}${caption}${OFF}\n</TFigure>`;

function printMatches(matches) {
	console.log("######## Matches ########");
	for (const match of matches) {
		const { name, alt, caption } = match.groups;
		const replacement = figure(name, alt, caption);

		console.log(`${BLUE}#### Match ####${OFF}`);
		console.log(`${PENCIL}${match[0]}${OFF}`);
		console.log({ name, alt, caption });
		console.log(`${RED}Replacement:${OFF}\n${figurePrint(name, alt, caption)}`);
		console.log(OFF);
	}
}

posts.on("data", (path) => {
	console.log(`Loaded ${path}`);
	const file = fs.readFileSync(path, { encoding: "utf-8" });
	const matches = file.matchAll(patterns.figure);
	printMatches(matches);
});
