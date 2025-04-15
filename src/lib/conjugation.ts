import type { JapaneseVerb, Tense, Polarity, Formality } from './types';
import { allRules } from './conjugation-rules/allRules';

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
		// No special-case handling - just use the irregular form directly from the data
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
	private verbs: JapaneseVerb[];

	constructor(verbs: JapaneseVerb[] = []) {
		this.verbs = verbs;
	}

	findVerb(dictionary: string): JapaneseVerb | undefined {
		return this.verbs.find(v => v.dictionary === dictionary);
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

	getAllVerbs(): JapaneseVerb[] {
		return this.verbs;
	}

	addVerb(verb: JapaneseVerb): void {
		this.verbs.push(verb);
	}

	removeVerb(dictionary: string): void {
		this.verbs = this.verbs.filter(v => v.dictionary !== dictionary);
	}
}

// Create a default conjugator instance
export const conjugator = new VerbConjugator();
