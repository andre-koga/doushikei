import type { ConjugationRule, VerbEnding } from '../types';
import { transformations } from './transformations';
import { getVerbStem } from './basic';

export const conditionalRules: Record<string, ConjugationRule[]> = {
    // BA FORM
    'conditionalBa-affirmative-plain': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'れば'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].e + 'れば';
            }
        }
    ],
    'conditionalBa-affirmative-polite': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'れば'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].e + 'れば';
            }
        }
    ],
    'conditionalBa-negative-plain': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'なければ'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].a + 'なければ';
            }
        }
    ],
    'conditionalBa-negative-polite': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'なければ'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].a + 'なければ';
            }
        }
    ],

    // TARA FORM
    'conditionalTara-affirmative-plain': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'たら'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                const teForm = stem + transformations.godan.endings[ending].te;
                return teForm.replace('て', 'たら').replace('で', 'だら');
            }
        }
    ],
    'conditionalTara-affirmative-polite': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'たら'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                const teForm = stem + transformations.godan.endings[ending].te;
                return teForm.replace('て', 'たら').replace('で', 'だら');
            }
        }
    ],
    'conditionalTara-negative-plain': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'なかったら'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].a + 'なかったら';
            }
        }
    ],
    'conditionalTara-negative-polite': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'なかったら'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].a + 'なかったら';
            }
        }
    ]
}; 