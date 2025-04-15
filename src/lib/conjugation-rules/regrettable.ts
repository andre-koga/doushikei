import type { ConjugationRule, VerbEnding } from '../types';
import { transformations } from './transformations';
import { getVerbStem } from './basic';

export const regrettableRules: Record<string, ConjugationRule[]> = {
    'regrettable-affirmative-plain': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'てしまう'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].te + 'しまう';
            }
        }
    ],
    'regrettable-affirmative-polite': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'てしまいます'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].te + 'しまいます';
            }
        }
    ],
    'regrettable-negative-plain': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'てしまわない'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].te + 'しまわない';
            }
        }
    ],
    'regrettable-negative-polite': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'てしまいません'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].te + 'しまいません';
            }
        }
    ]
}; 