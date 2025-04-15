import type { ConjugationRule, VerbEnding } from '../types';
import { transformations } from './transformations';
import { getVerbStem } from './basic';

export const preparatoryRules: Record<string, ConjugationRule[]> = {
	'preparatory-affirmative-plain': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ておく'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending as VerbEnding;
				return stem + transformations.godan.endings[ending].te + 'おく';
			}
		}
	],
	'preparatory-affirmative-polite': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ておきます'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending as VerbEnding;
				return stem + transformations.godan.endings[ending].te + 'おきます';
			}
		}
	],
	'preparatory-negative-plain': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ておかない'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending as VerbEnding;
				return stem + transformations.godan.endings[ending].te + 'おかない';
			}
		}
	],
	'preparatory-negative-polite': [
		{
			appliesTo: ['ichidan'],
			transform: (verb) => getVerbStem(verb, 'ichidan') + 'ておきません'
		},
		{
			appliesTo: ['godan'],
			transform: (verb) => {
				if (verb.type === 'irregular') return verb.dictionary;
				if (!verb.ending) return verb.dictionary;
				const stem = getVerbStem(verb, 'godan');
				const ending = verb.ending as VerbEnding;
				return stem + transformations.godan.endings[ending].te + 'おきません';
			}
		}
	]
};
