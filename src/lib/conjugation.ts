import type { JapaneseVerb, Tense, Polarity, Formality } from './types';
import { allRules } from './conjugation-rules';
import { allVerbs } from './jlpt-verbs';

// Main conjugate function that applies the rules
export function conjugateVerb(
	verb: JapaneseVerb,
	tense: Tense,
	polarity: Polarity = 'affirmative',
	formality: Formality = 'plain'
): string {
	const formKey = `${tense}-${polarity}-${formality}` as `${Tense}-${Polarity}-${Formality}`;

	// Handle irregular verbs with pre-defined forms
	if (verb.type === 'irregular' && verb.irregularForms && verb.irregularForms[formKey]) {
		return verb.irregularForms[formKey];
	}

	// Get the rules for this form
	const rules = allRules[formKey];
	if (!rules) {
		return verb.dictionary; // Default to dictionary form if no rules found
	}

	// Find the first applicable rule and apply it
	for (const rule of rules) {
		if (rule.appliesTo.includes(verb.type)) {
			return rule.transform(verb);
		}
	}

	return verb.dictionary; // Fallback
}

// Utility to create a form key for lookups
export function getConjugationKey(tense: Tense, polarity: Polarity, formality: Formality): string {
	return `${tense}-${polarity}-${formality}`;
}

// ==================== Answer Checking ====================

// Simplify the check answer function for better readability
export function checkAnswer(expected: string, actual: string): boolean {
	// Normalize both strings for comparison
	const normalizedExpected = expected.trim().replace(/\s+/g, '');
	const normalizedActual = actual.trim().replace(/\s+/g, '');

	// Exact match
	if (normalizedExpected === normalizedActual) {
		return true;
	}

	// Handle particle variations (は/わ, へ/え, を/お)
	const particleExpected = normalizedExpected
		.replace(/は/g, 'わ')
		.replace(/へ/g, 'え')
		.replace(/を/g, 'お');

	const particleActual = normalizedActual
		.replace(/は/g, 'わ')
		.replace(/へ/g, 'え')
		.replace(/を/g, 'お');

	if (particleExpected === particleActual) {
		return true;
	}

	return false;
}

// ==================== VerbConjugator Class ====================

export class VerbConjugator {
	private selectedLevels: Set<'n5' | 'n4' | 'n3' | 'n2' | 'n1'>;
	private recentVerbs: string[]; // Store dictionary forms of recent verbs
	private readonly maxRecentVerbs = 20;

	constructor(initialLevels: ('n5' | 'n4' | 'n3' | 'n2' | 'n1')[] = ['n5']) {
		this.selectedLevels = new Set(initialLevels);
		this.recentVerbs = [];
	}

	setLevels(levels: ('n5' | 'n4' | 'n3' | 'n2' | 'n1')[]): void {
		this.selectedLevels = new Set(levels);
	}

	addLevel(level: 'n5' | 'n4' | 'n3' | 'n2' | 'n1'): void {
		this.selectedLevels.add(level);
	}

	removeLevel(level: 'n5' | 'n4' | 'n3' | 'n2' | 'n1'): void {
		this.selectedLevels.delete(level);
		// Ensure at least one level is selected
		if (this.selectedLevels.size === 0) {
			this.selectedLevels.add('n5');
		}
	}

	getSelectedLevels(): string[] {
		return Array.from(this.selectedLevels);
	}

	findVerb(dictionary: string): JapaneseVerb | undefined {
		// Search through all selected levels
		for (const level of this.selectedLevels) {
			const verb = allVerbs[level].find(v => v.dictionary === dictionary);
			if (verb) return verb;
		}
		return undefined;
	}

	conjugate(verb: JapaneseVerb, tense: Tense, polarity: Polarity = 'affirmative', formality: Formality = 'plain'): string {
		// Convert the verb to use kana instead of dictionary form for all conjugations
		const internalVerb: JapaneseVerb = {
			dictionary: verb.kana,  // Use kana instead of dictionary
			kana: verb.kana,
			meaning: verb.meaning,
			type: verb.type,
			ending: verb.ending as JapaneseVerb['ending'],
			irregularForms: verb.irregularForms
		};

		// Use the rule-based conjugation function
		return conjugateVerb(internalVerb, tense, polarity, formality);
	}

	getRandomVerb(): JapaneseVerb {
		// Get a random level from selected levels
		const levels = Array.from(this.selectedLevels);
		const randomLevel = levels[Math.floor(Math.random() * levels.length)];

		// Get verbs from the selected level
		const levelVerbs = allVerbs[randomLevel];

		// Filter out recent verbs
		const availableVerbs = levelVerbs.filter(verb => !this.recentVerbs.includes(verb.dictionary));

		// If all verbs have been used recently, clear the recent verbs list
		if (availableVerbs.length === 0) {
			this.recentVerbs = [];
			return this.getRandomVerb();
		}

		// Get a random verb from available verbs
		const randomIndex = Math.floor(Math.random() * availableVerbs.length);
		const selectedVerb = availableVerbs[randomIndex];

		// Add to recent verbs
		this.recentVerbs.push(selectedVerb.dictionary);

		// Maintain the size limit of recent verbs
		if (this.recentVerbs.length > this.maxRecentVerbs) {
			this.recentVerbs.shift();
		}

		return selectedVerb;
	}

	getVerbsForLevel(level: 'n5' | 'n4' | 'n3' | 'n2' | 'n1'): JapaneseVerb[] {
		return allVerbs[level];
	}

	getAllVerbs(): JapaneseVerb[] {
		const allSelectedVerbs: JapaneseVerb[] = [];
		for (const level of this.selectedLevels) {
			allSelectedVerbs.push(...allVerbs[level]);
		}
		return allSelectedVerbs;
	}
}

// Create a default conjugator instance
export const conjugator = new VerbConjugator();
