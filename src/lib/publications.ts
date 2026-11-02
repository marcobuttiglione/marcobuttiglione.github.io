import fs from 'node:fs';
import path from 'node:path';
import { BibtexParser } from 'bibtex-js-parser';
import { publicationMetadata, type PublicationMetadata } from '../data/publications';

export interface Publication {
	id: string;
	title: string;
	authors: string;
	authorList: string[];
	venue: string;
	year: number;
	month: number;
	volume?: string;
	pages?: string;
	doi?: string;
	bibtex: string;
	metadata: PublicationMetadata;
}

// "Buttiglione, Marco Domenico" -> "Buttiglione, M. D."
function formatAuthorList(authorString: string): string[] {
	if (!authorString) return [];

	return authorString.split(' and ').map(auth => {
		const parts = auth.trim().split(',');
		if (parts.length < 2) return auth; // Can't parse

		const surname = parts[0].trim();
		const names = parts[1].trim().split(/\s+/);

		const initials = names.map(n => n[0].toUpperCase() + '.').join(' ');

		return `${surname}, ${initials}`;
	});
}

function formatAuthors(authorString: string) {
	const formattedAuthors = formatAuthorList(authorString);

	if (formattedAuthors.length === 0) return '';
	if (formattedAuthors.length === 1) return formattedAuthors[0];

	const lastAuthor = formattedAuthors.pop();
	return `${formattedAuthors.join(', ')} and ${lastAuthor}`;
}

// Clean BibTeX for "Cite": only the fields a reference manager needs, no Scopus noise
function toBibtex(entry: any): string {
	const fields: [string, string | undefined][] = [
		['author', entry.author],
		['title', entry.title],
		['booktitle', entry.journal || entry.booktitle],
		['year', entry.year],
		['volume', entry.volume],
		['pages', entry.pages?.replace(/\s*[–-]+\s*/, '--')],
		['doi', entry.doi],
	];
	const body = fields
		.filter(([, value]) => value)
		.map(([key, value]) => `  ${key.padEnd(9)} = {${value}}`)
		.join(',\n');
	return `@inproceedings{${entry.id},\n${body}\n}`;
}

// Reads src/assets/scopus.bib and returns all publications, newest first.
export function getPublications(): Publication[] {
	const bibPath = path.join(process.cwd(), 'src/assets/scopus.bib');
	const bibContent = fs.readFileSync(bibPath, 'utf-8');

	// Strip the "Scopus EXPORT DATE..." header, which the parser can't handle
	const cleanBibContent = bibContent
		.replace(/^[﻿]?Scopus[\s\S]*?@/, '@')
		.replace(/@CONFERENCE/g, '@inproceedings');

	const entries = BibtexParser.parseToJSON(cleanBibContent);

	return entries
		.map((entry: any): Publication => ({
			id: entry.id,
			title: entry.title,
			authors: formatAuthors(entry.author),
			authorList: formatAuthorList(entry.author),
			venue: entry.journal || entry.booktitle || 'Conference/Journal',
			year: parseInt(entry.year),
			month: parseInt(entry.month) || 0,
			volume: entry.volume?.replace(/^Volume\s+/i, ''), // ASME: "Volume 2B: ..." would read "vol. Volume 2B"
			pages: entry.pages?.replace(/\s*[–-]+\s*/, '–'),
			doi: entry.doi,
			bibtex: toBibtex(entry),
			metadata: publicationMetadata[entry.id] ?? {},
		}))
		.sort((a, b) => b.year - a.year || b.month - a.month);
}
