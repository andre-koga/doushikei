import type { ConjugationRule, VerbEnding } from '../types';
import { transformations } from './transformations';
import { getVerbStem } from './basic';

export const mustRules: Record<string, ConjugationRule[]> = {
    'must-affirmative-plain': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'なければならない'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].a + 'なければならない';
            }
        }
    ],
    'must-affirmative-polite': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'なければなりません'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].a + 'なければなりません';
            }
        }
    ],
    'must-negative-plain': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'なくてもいい'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].a + 'なくてもいい';
            }
        }
    ],
    'must-negative-polite': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'なくてもいいです'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].a + 'なくてもいいです';
            }
        }
    ]
}; 