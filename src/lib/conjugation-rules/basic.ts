import type { JapaneseVerb, ConjugationRule, VerbEnding } from '../types';
import { transformations } from './transformations';

export function getVerbStem(verb: JapaneseVerb, stemType?: 'ichidan' | 'godan'): string {
	const typeToCheck = stemType || verb.type;
	if (typeToCheck === 'ichidan') {
		return verb.dictionary.slice(0, -1);
	} else if (typeToCheck === 'godan') {
		return verb.dictionary.slice(0, -1);
	}
	return verb.dictionary;
}

export const basicRules: Record<string, ConjugationRule[]> = {
	// PRESENT TENSE
	'present-affirmative-plain': [
		{
			appliesTo: ['ichidan', 'godan', 'irregular'],
			transform: (verb) => verb.dictionary
		}
	],
	'present-affirmative-polite': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ます'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending as VerbEnding;
				return stem + transformations.godan.endings[ending].i + 'ます';
			}
		}
	],
	'present-negative-plain': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ない'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending;
				return stem + transformations.godan.endings[ending].a + 'ない';
			}
		}
	],
	'present-negative-polite': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ません'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending;
				return stem + transformations.godan.endings[ending].i + 'ません';
			}
		}
	],

	// PAST TENSE
	'past-affirmative-plain': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'た'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending;
				const teForm = stem + transformations.godan.endings[ending].te;
				return teForm.replace('て', 'た').replace('で', 'だ');
			}
		}
	],
	'past-affirmative-polite': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ました'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending;
				return stem + transformations.godan.endings[ending].i + 'ました';
			}
		}
	],
	'past-negative-plain': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'なかった'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending;
				return stem + transformations.godan.endings[ending].a + 'なかった';
			}
		}
	],
	'past-negative-polite': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ませんでした'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending;
				return stem + transformations.godan.endings[ending].i + 'ませんでした';
			}
		}
	],

	// TE FORM
	'teForm-affirmative-plain': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'て'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending;
				return stem + transformations.godan.endings[ending].te;
			}
		}
	],
	'teForm-negative-plain': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'なくて'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending;
				return stem + transformations.godan.endings[ending].a + 'なくて';
			}
		}
	]
};
