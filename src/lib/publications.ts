import fs from 'node:fs';
import path from 'node:path';
import { BibtexParser } from 'bibtex-js-parser';
import { publicationMetadata, type PublicationMetadata } from '../data/publications';

export interface Publication {
	id: string;
	title: string;
	authors: string;
	venue: string;
	year: number;
	month: number;
	doi?: string;
	metadata: PublicationMetadata;
}

function formatAuthors(authorString: string) {
	if (!authorString) return '';

	const authors = authorString.split(' and ');

	const formattedAuthors = authors.map(auth => {
		const parts = auth.trim().split(',');
		if (parts.length < 2) return auth; // Can't parse

		const surname = parts[0].trim();
		const names = parts[1].trim().split(/\s+/);

		const initials = names.map(n => n[0].toUpperCase() + '.').join(' ');

		return `${surname}, ${initials}`;
	});

	if (formattedAuthors.length === 0) return '';
	if (formattedAuthors.length === 1) return formattedAuthors[0];

	const lastAuthor = formattedAuthors.pop();
	return `${formattedAuthors.join(', ')} and ${lastAuthor}`;
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
			venue: entry.journal || entry.booktitle || 'Conference/Journal',
			year: parseInt(entry.year),
			month: parseInt(entry.month) || 0,
			doi: entry.doi,
			metadata: publicationMetadata[entry.id] ?? {},
		}))
		.sort((a, b) => b.year - a.year || b.month - a.month);
}
