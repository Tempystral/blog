const imageCache: Record<string, () => Promise<{ default: ImageMetadata }>> = await getAllImages();
// console.log("Cached images:\n  " + Object.keys(imageCache).join("\n  "));

async function getAllImages() {
	return import.meta.glob<{ default: ImageMetadata }>(
		"@/content/post/**/*.{jpeg,jpg,png,gif,webp}",
	);
}

async function getCachedImage(key: string) {
	return imageCache[key] ? (await imageCache[key]()).default : null;
}

export { imageCache, getAllImages, getCachedImage };
