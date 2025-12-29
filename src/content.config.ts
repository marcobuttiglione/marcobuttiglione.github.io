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
			heroImage: z.union([image(), z.string()]).optional(),
			youtubeVideo: z.string().optional(),
			tags: z.array(z.string()).optional(),
			role: z.string().optional(), // New: Specific role (e.g. "Lead Dev")
			projectType: z.string().optional(), // New: Type of project (e.g. "PhD Research", "Game Jam")
			gallery: z.array(image()).optional(), // New: Gallery images
			link: z.string().optional(), // External link if needed
			inDevelopment: z.boolean().optional().default(false),
		}),
});

export const collections = { projects };
