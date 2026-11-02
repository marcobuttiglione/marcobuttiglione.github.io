// /publications.bib: every paper as clean BibTeX, newest first
import type { APIRoute } from 'astro';
import { getPublications } from '../lib/publications';

export const GET: APIRoute = () =>
	new Response(getPublications().map((p) => p.bibtex).join('\n\n') + '\n', {
		headers: { 'Content-Type': 'application/x-bibtex; charset=utf-8' },
	});
