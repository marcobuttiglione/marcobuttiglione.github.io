import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

// Featured first, then projects in development, then newest first
export async function getProjects(): Promise<Project[]> {
	return (await getCollection('projects')).sort((a, b) => {
		if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
		if (a.data.inDevelopment !== b.data.inDevelopment) return a.data.inDevelopment ? -1 : 1;
		return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
	});
}

// "Commercial Game" -> games, anything else -> research
export const projectCategory = (p: Project) => (p.data.projectType?.toLowerCase().includes('game') ? 'games' : 'research');

export const projectStatus = (p: Project) => (p.data.inDevelopment ? 'In development' : String(p.data.pubDate.getUTCFullYear()));

// Label for the main external link, from its domain
export function linkLabel(url: string) {
	if (url.includes('steampowered.com')) return 'View on Steam';
	if (url.includes('github.com')) return 'View code on GitHub';
	return 'Visit project';
}
