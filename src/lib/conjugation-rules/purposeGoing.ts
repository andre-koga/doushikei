import type { ConjugationRule, VerbEnding } from '../types';
import { transformations } from './transformations';
import { getVerbStem } from './basic';

export const purposeGoingRules: Record<string, ConjugationRule[]> = {
    'purposeGoing-affirmative-plain': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'に行く'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].i + 'に行く';
            }
        }
    ],
    'purposeGoing-affirmative-polite': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'に行きます'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].i + 'に行きます';
            }
        }
    ],
    'purposeGoing-negative-plain': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'に行かない'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].i + 'に行かない';
            }
        }
    ],
    'purposeGoing-negative-polite': [
        {
            appliesTo: ['ichidan'],
            transform: (verb) => getVerbStem(verb, 'ichidan') + 'に行きません'
        },
        {
            appliesTo: ['godan'],
            transform: (verb) => {
                if (!verb.ending) return verb.dictionary;
                const stem = getVerbStem(verb, 'godan');
                const ending = verb.ending as VerbEnding;
                return stem + transformations.godan.endings[ending].i + 'に行きません';
            }
        }
    ]
}; 