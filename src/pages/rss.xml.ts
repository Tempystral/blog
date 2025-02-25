import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";
import rss from "@astrojs/rss";
import { DateTime, Settings } from "luxon";

Settings.defaultZone = "America/Toronto";

export const GET = async () => {
	const posts = await getAllPosts();

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		customData: `<language>en</language>
    `,
		site: import.meta.env.SITE,
		items: posts
			.sort((a, b) =>
				DateTime.fromJSDate(b.data.publishDate)
					.diff(DateTime.fromJSDate(a.data.publishDate))
					.as("milliseconds"),
			)
			.map((post) => ({
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.publishDate,
				link: `posts/${post.id}/`,
			})),
	});
};
