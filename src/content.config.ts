import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			company: z.string().optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			youtubeVideo: z.string().optional(),
			tags: z.array(z.string()).optional(),
			link: z.string().optional(), // External link if needed
			inDevelopment: z.boolean().optional().default(false),
		}),
});

export const collections = { projects };
