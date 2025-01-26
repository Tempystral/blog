export async function loadImage(path: string) {
	const images = import.meta.glob<{ default: ImageMetadata }>(
		"@/{assets|content/post}/images/*.{jpeg,jpg,png,gif,webp}",
	);
	const fullPath = `/src/assets/${path}`;
	if (!images[fullPath])
		throw new Error(`"${path}" does not exist in glob: @/assets/images/*.{jpeg,jpg,png,gif,webp}`);

	return (await images[fullPath]()).default;
}

export async function loadVideo(path: string) {
	const assets = import.meta.glob<{ default: { src: string; format: "mp4" | "avif" | "webm" } }>(
		"@/assets/videos/*.{avif,mp4,webm}",
	);
	const fullPath = `/src/assets/${path}`;
	if (!assets[fullPath])
		throw new Error(`"${path}" does not exist in glob: @/assets/videos/*.{jpeg,jpg,png,gif,webp}`);

	return (await assets[fullPath]()).default;
}
