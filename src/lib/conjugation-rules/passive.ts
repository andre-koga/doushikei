import type { ConjugationRule, VerbEnding } from '../types';
import { transformations } from './transformations';
import { getVerbStem } from './basic';

export const passiveRules: Record<string, ConjugationRule[]> = {
    'passive-affirmative-plain': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'られる'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].a + 'れる';
            }
        }
    ],
    'passive-affirmative-polite': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'られます'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].a + 'れます';
            }
        }
    ],
    'passive-negative-plain': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'られない'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].a + 'れない';
            }
        }
    ],
    'passive-negative-polite': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'られません'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].a + 'れません';
            }
        }
    ]
}; 