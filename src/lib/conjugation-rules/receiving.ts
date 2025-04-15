import type { ConjugationRule, VerbEnding } from '../types';
import { transformations } from './transformations';
import { getVerbStem } from './basic';

export const receivingRules: Record<string, ConjugationRule[]> = {
	'receiving-affirmative-plain': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'てもらう'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending as VerbEnding;
				return stem + transformations.godan.endings[ending].te + 'もらう';
			}
		}
	],
	'receiving-affirmative-polite': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ていただきます'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending as VerbEnding;
				return stem + transformations.godan.endings[ending].te + 'いただきます';
			}
		}
	],
	'receiving-negative-plain': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'てもらわない'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending as VerbEnding;
				return stem + transformations.godan.endings[ending].te + 'もらわない';
			}
		}
	],
	'receiving-negative-polite': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ていただきません'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending as VerbEnding;
				return stem + transformations.godan.endings[ending].te + 'いただきません';
			}
		}
	]
};
