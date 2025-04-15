import type { ConjugationRule, VerbEnding } from '../types';
import { transformations } from './transformations';
import { getVerbStem } from './basic';

export const imperativeRules: Record<string, ConjugationRule[]> = {
	'imperative-affirmative-plain': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ろ'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending as VerbEnding;
				return stem + transformations.godan.endings[ending].e + 'ろ';
			}
		}
	],
	'imperative-affirmative-polite': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'てください'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending as VerbEnding;
				return stem + transformations.godan.endings[ending].te + 'ください';
			}
		}
	],
	'imperative-negative-plain': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'るな'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending as VerbEnding;
				return stem + transformations.godan.endings[ending].a + 'な';
			}
		}
	],
	'imperative-negative-polite': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ないでください'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending as VerbEnding;
				return stem + transformations.godan.endings[ending].a + 'ないでください';
			}
		}
	]
};
