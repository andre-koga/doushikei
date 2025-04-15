import type { ConjugationRule } from '../types';
import { transformations } from './transformations';
import { getVerbStem } from './basic';

export const simultaneousRules: Record<string, ConjugationRule[]> = {
	'simultaneous-affirmative-plain': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ながら'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type !== 'godan') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending;
				return stem + transformations.godan.endings[ending].a + 'ながら';
			}
		}
	],
	'simultaneous-affirmative-polite': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ながら'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type !== 'godan') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending;
				return stem + transformations.godan.endings[ending].a + 'ながら';
			}
		}
	],
	'simultaneous-negative-plain': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ないながら'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type !== 'godan') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending;
				return stem + transformations.godan.endings[ending].a + 'ないながら';
			}
		}
	],
	'simultaneous-negative-polite': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ませんながら'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type !== 'godan') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending;
				return stem + transformations.godan.endings[ending].a + 'ませんながら';
			}
		}
	]
};
