import type { JapaneseVerb, Tense, Polarity, Formality } from './types';
import { allRules } from './conjugation-rules';
import { allVerbs } from './jlpt-verbs';
import { enabledJLPTLevels } from './stores/preferenceStore';
import { get } from 'svelte/store';

type JLPTLevel = 'n5' | 'n4' | 'n3' | 'n2' | 'n1';

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
	private recentVerbs: string[] = [];
	private maxRecentVerbs = 10;

	findVerb(dictionary: string): JapaneseVerb | undefined {
		// Get the currently selected levels from the store
		const selectedLevels = get(enabledJLPTLevels) as JLPTLevel[];

		// Search through all selected levels
		for (const level of selectedLevels) {
			const verb = allVerbs[level].find((v: JapaneseVerb) => v.dictionary === dictionary);
			if (verb) return verb;
		}
		return undefined;
	}

	conjugate(
		verb: JapaneseVerb,
		tense: Tense,
		polarity: Polarity = 'affirmative',
		formality: Formality = 'plain'
	): string {
		// Convert the verb to use kana instead of dictionary form for all conjugations
		const internalVerb = {
			dictionary: verb.kana, // Use kana instead of dictionary
			kana: verb.kana,
			meaning: verb.meaning,
			type: verb.type,
			...(verb.type !== 'irregular' && { ending: verb.ending }),
			...(verb.type === 'irregular' && { irregularForms: verb.irregularForms })
		} as JapaneseVerb;

		// Use the rule-based conjugation function
		return conjugateVerb(internalVerb, tense, polarity, formality);
	}

	getRandomVerb(): JapaneseVerb {
		// Get the currently selected levels from the store
		const selectedLevels = get(enabledJLPTLevels) as JLPTLevel[];
		if (selectedLevels.length === 0) {
			// Fallback to N5 if no levels are selected
			selectedLevels.push('n5');
		}

		// Get a random level from selected levels
		const randomLevel = selectedLevels[Math.floor(Math.random() * selectedLevels.length)];

		// Get verbs from the selected level
		const levelVerbs = allVerbs[randomLevel];

		// Filter out recent verbs
		const availableVerbs = levelVerbs.filter(
			(verb: JapaneseVerb) => !this.recentVerbs.includes(verb.dictionary)
		);

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

	getVerbsForLevel(level: JLPTLevel): JapaneseVerb[] {
		return allVerbs[level];
	}

	getAllVerbs(): JapaneseVerb[] {
		const allSelectedVerbs: JapaneseVerb[] = [];
		const selectedLevels = get(enabledJLPTLevels) as JLPTLevel[];
		for (const level of selectedLevels) {
			allSelectedVerbs.push(...allVerbs[level]);
		}
		return allSelectedVerbs;
	}
}

// Create a default conjugator instance
export const conjugator = new VerbConjugator();
