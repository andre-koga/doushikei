import type { Verb } from './verbs';

// Helper function to get the verb stem
function getVerbStem(verb: Verb): string {
    if (verb.type === 'ichidan') {
        // For ichidan verbs, remove the final る
        return verb.dictionary.slice(0, -1);
    } else if (verb.type === 'godan') {
        // For godan verbs, we keep the full dictionary form for now
        // Specific conjugation functions will handle the stem changes
        return verb.dictionary;
    } else {
        // For irregular verbs like する and 来る
        if (verb.dictionary === '来る') {
            return '来';
        } else if (verb.dictionary === 'する') {
            return 'し';
        }
        return verb.dictionary;
    }
}

// Helper function to get the godan verb consonant stem
function getGodanConsonantStem(verb: Verb): string {
    if (verb.type !== 'godan') return '';

    // Remove the final vowel
    return verb.dictionary.slice(0, -1);
}

// Map godan verb endings to their corresponding sounds for different conjugations
const godanConjugationMap: Record<string, Record<string, string>> = {
    'u': {
        'a': 'わ', 'i': 'い', 'e': 'え', 'o': 'お', 'te': 'って'
    },
    'ku': {
        'a': 'か', 'i': 'き', 'e': 'け', 'o': 'こ', 'te': 'いて'
    },
    'gu': {
        'a': 'が', 'i': 'ぎ', 'e': 'げ', 'o': 'ご', 'te': 'いで'
    },
    'su': {
        'a': 'さ', 'i': 'し', 'e': 'せ', 'o': 'そ', 'te': 'して'
    },
    'tsu': {
        'a': 'た', 'i': 'ち', 'e': 'て', 'o': 'と', 'te': 'って'
    },
    'nu': {
        'a': 'な', 'i': 'に', 'e': 'ね', 'o': 'の', 'te': 'んで'
    },
    'bu': {
        'a': 'ば', 'i': 'び', 'e': 'べ', 'o': 'ぼ', 'te': 'んで'
    },
    'mu': {
        'a': 'ま', 'i': 'み', 'e': 'め', 'o': 'も', 'te': 'んで'
    },
    'ru': {
        'a': 'ら', 'i': 'り', 'e': 'れ', 'o': 'ろ', 'te': 'って'
    }
};

// Function to conjugate verbs based on tense, polarity and formality
export function conjugateVerb(
    verb: Verb,
    tense: string,
    polarity: string = 'affirmative',
    formality: string = 'plain'
): string {
    // For irregular verbs, check if we have a pre-defined form
    const formKey = `${tense}-${polarity}-${formality}`;
    if (verb.type === 'irregular' && verb.irregularForms && verb.irregularForms[formKey]) {
        return verb.irregularForms[formKey];
    }

    // Special handling for する and 来る if needed forms aren't in irregularForms
    if (verb.dictionary === 'する' || verb.dictionary === '来る') {
        return conjugateIrregularVerb(verb, tense, polarity, formality);
    }

    // Handle based on tense
    switch (tense) {
        case 'present':
            return conjugatePresent(verb, polarity, formality);
        case 'past':
            return conjugatePast(verb, polarity, formality);
        case 'teForm':
            return conjugateTeForm(verb, polarity);
        case 'potential':
            return conjugatePotential(verb, polarity, formality);
        case 'passive':
            return conjugatePassive(verb, polarity, formality);
        case 'causative':
            return conjugateCausative(verb, polarity, formality);
        case 'imperative':
            return conjugateImperative(verb, polarity, formality);
        case 'volitional':
            return conjugateVolitional(verb, polarity, formality);
        default:
            return verb.dictionary; // Default to dictionary form
    }
}

// Present tense conjugation
function conjugatePresent(verb: Verb, polarity: string, formality: string): string {
    if (polarity === 'affirmative') {
        if (formality === 'plain') {
            return verb.dictionary; // Dictionary form is present plain affirmative
        } else { // Polite form
            if (verb.type === 'ichidan') {
                return getVerbStem(verb) + 'ます';
            } else if (verb.type === 'godan' && verb.ending) {
                const stem = getGodanConsonantStem(verb);
                return stem + godanConjugationMap[verb.ending]['i'] + 'ます';
            }
        }
    } else { // Negative
        if (formality === 'plain') {
            if (verb.type === 'ichidan') {
                return getVerbStem(verb) + 'ない';
            } else if (verb.type === 'godan' && verb.ending) {
                const stem = getGodanConsonantStem(verb);
                return stem + godanConjugationMap[verb.ending]['a'] + 'ない';
            }
        } else { // Polite negative
            if (verb.type === 'ichidan') {
                return getVerbStem(verb) + 'ません';
            } else if (verb.type === 'godan' && verb.ending) {
                const stem = getGodanConsonantStem(verb);
                return stem + godanConjugationMap[verb.ending]['i'] + 'ません';
            }
        }
    }
    return verb.dictionary; // Fallback
}

// Past tense conjugation
function conjugatePast(verb: Verb, polarity: string, formality: string): string {
    if (polarity === 'affirmative') {
        if (formality === 'plain') {
            if (verb.type === 'ichidan') {
                return getVerbStem(verb) + 'た';
            } else if (verb.type === 'godan' && verb.ending) {
                const stem = getGodanConsonantStem(verb);
                const teForm = stem + godanConjugationMap[verb.ending]['te'];
                // Convert te-form to past by changing て to た, で to だ
                return teForm.replace('て', 'た').replace('で', 'だ');
            }
        } else { // Polite past affirmative
            if (verb.type === 'ichidan') {
                return getVerbStem(verb) + 'ました';
            } else if (verb.type === 'godan' && verb.ending) {
                const stem = getGodanConsonantStem(verb);
                return stem + godanConjugationMap[verb.ending]['i'] + 'ました';
            }
        }
    } else { // Negative past
        if (formality === 'plain') {
            if (verb.type === 'ichidan') {
                return getVerbStem(verb) + 'なかった';
            } else if (verb.type === 'godan' && verb.ending) {
                const stem = getGodanConsonantStem(verb);
                return stem + godanConjugationMap[verb.ending]['a'] + 'なかった';
            }
        } else { // Polite negative past
            if (verb.type === 'ichidan') {
                return getVerbStem(verb) + 'ませんでした';
            } else if (verb.type === 'godan' && verb.ending) {
                const stem = getGodanConsonantStem(verb);
                return stem + godanConjugationMap[verb.ending]['i'] + 'ませんでした';
            }
        }
    }
    return verb.dictionary; // Fallback
}

// Te-form conjugation
function conjugateTeForm(verb: Verb, polarity: string): string {
    if (polarity === 'affirmative') {
        if (verb.type === 'ichidan') {
            return getVerbStem(verb) + 'て';
        } else if (verb.type === 'godan' && verb.ending) {
            const stem = getGodanConsonantStem(verb);
            return stem + godanConjugationMap[verb.ending]['te'];
        }
    } else { // Negative te-form (usually using なくて)
        if (verb.type === 'ichidan') {
            return getVerbStem(verb) + 'なくて';
        } else if (verb.type === 'godan' && verb.ending) {
            const stem = getGodanConsonantStem(verb);
            return stem + godanConjugationMap[verb.ending]['a'] + 'なくて';
        }
    }
    return verb.dictionary; // Fallback
}

// Potential form conjugation
function conjugatePotential(verb: Verb, polarity: string, formality: string): string {
    // Base potential form
    let potentialBase = '';
    if (verb.type === 'ichidan') {
        potentialBase = getVerbStem(verb) + 'られ';
    } else if (verb.type === 'godan' && verb.ending) {
        const stem = getGodanConsonantStem(verb);
        potentialBase = stem + godanConjugationMap[verb.ending]['e'];
    }

    // Apply polarity and formality
    if (polarity === 'affirmative') {
        if (formality === 'plain') {
            return potentialBase + 'る';
        } else { // Polite
            return potentialBase + 'ます';
        }
    } else { // Negative
        if (formality === 'plain') {
            return potentialBase + 'ない';
        } else { // Polite
            return potentialBase + 'ません';
        }
    }
}

// Passive form conjugation (simplified)
function conjugatePassive(verb: Verb, polarity: string, formality: string): string {
    // Base passive form
    let passiveBase = '';
    if (verb.type === 'ichidan') {
        passiveBase = getVerbStem(verb) + 'られ';
    } else if (verb.type === 'godan' && verb.ending) {
        const stem = getGodanConsonantStem(verb);
        passiveBase = stem + godanConjugationMap[verb.ending]['a'] + 'れ';
    }

    // Apply polarity and formality
    if (polarity === 'affirmative') {
        if (formality === 'plain') {
            return passiveBase + 'る';
        } else { // Polite
            return passiveBase + 'ます';
        }
    } else { // Negative
        if (formality === 'plain') {
            return passiveBase + 'ない';
        } else { // Polite
            return passiveBase + 'ません';
        }
    }
}

// Causative form conjugation (simplified)
function conjugateCausative(verb: Verb, polarity: string, formality: string): string {
    // Base causative form
    let causativeBase = '';
    if (verb.type === 'ichidan') {
        causativeBase = getVerbStem(verb) + 'させ';
    } else if (verb.type === 'godan' && verb.ending) {
        const stem = getGodanConsonantStem(verb);
        causativeBase = stem + godanConjugationMap[verb.ending]['a'] + 'せ';
    }

    // Apply polarity and formality
    if (polarity === 'affirmative') {
        if (formality === 'plain') {
            return causativeBase + 'る';
        } else { // Polite
            return causativeBase + 'ます';
        }
    } else { // Negative
        if (formality === 'plain') {
            return causativeBase + 'ない';
        } else { // Polite
            return causativeBase + 'ません';
        }
    }
}

// Imperative form conjugation (simplified)
function conjugateImperative(verb: Verb, polarity: string, formality: string): string {
    if (polarity === 'affirmative') {
        if (formality === 'plain') { // Plain command (harsh)
            if (verb.type === 'ichidan') {
                return getVerbStem(verb) + 'ろ';
            } else if (verb.type === 'godan' && verb.ending) {
                const stem = getGodanConsonantStem(verb);
                return stem + godanConjugationMap[verb.ending]['e'];
            }
        } else { // Polite imperative (using te kudasai)
            return conjugateTeForm(verb, 'affirmative') + ' ください';
        }
    } else { // Negative command
        if (formality === 'plain') {
            return conjugatePresent(verb, 'affirmative', 'plain') + 'な';
        } else { // Polite negative imperative
            return conjugatePresent(verb, 'negative', 'polite') + ' ください';
        }
    }
    return verb.dictionary; // Fallback
}

// Volitional form conjugation (simplified)
function conjugateVolitional(verb: Verb, polarity: string, formality: string): string {
    if (polarity === 'affirmative') {
        if (formality === 'plain') {
            if (verb.type === 'ichidan') {
                return getVerbStem(verb) + 'よう';
            } else if (verb.type === 'godan' && verb.ending) {
                const stem = getGodanConsonantStem(verb);
                return stem + godanConjugationMap[verb.ending]['o'] + 'う';
            }
        } else { // Polite volitional
            if (verb.type === 'ichidan') {
                return getVerbStem(verb) + 'ましょう';
            } else if (verb.type === 'godan' && verb.ending) {
                const stem = getGodanConsonantStem(verb);
                return stem + godanConjugationMap[verb.ending]['i'] + 'ましょう';
            }
        }
    } else { // Negative volitional (not common, using other constructions)
        if (formality === 'plain') {
            return conjugatePresent(verb, 'negative', 'plain') + 'だろう';
        } else { // Polite
            return conjugatePresent(verb, 'negative', 'polite') + 'でしょう';
        }
    }
    return verb.dictionary; // Fallback
}

// Handle special irregular verbs like する and 来る
function conjugateIrregularVerb(
    verb: Verb,
    tense: string,
    polarity: string,
    formality: string
): string {
    // This function would implement special rules for する and 来る
    // but is simplified here
    if (verb.dictionary === 'する') {
        // Example cases - would need to be expanded for all tense/polarity/formality combinations
        if (tense === 'present' && polarity === 'affirmative') {
            return formality === 'plain' ? 'する' : 'します';
        } else if (tense === 'past' && polarity === 'affirmative') {
            return formality === 'plain' ? 'した' : 'しました';
        } else if (tense === 'teForm' && polarity === 'affirmative') {
            return 'して';
        }
    } else if (verb.dictionary === '来る') {
        // Example cases for 来る
        if (tense === 'present' && polarity === 'affirmative') {
            return formality === 'plain' ? '来る' : '来ます';
        } else if (tense === 'past' && polarity === 'affirmative') {
            return formality === 'plain' ? '来た' : '来ました';
        } else if (tense === 'teForm' && polarity === 'affirmative') {
            return '来て';
        }
    }

    return verb.dictionary; // Fallback
}

// Generate a conjugation pattern key for caching and lookup
export function getConjugationKey(tense: string, polarity: string, formality: string): string {
    return `${tense}-${polarity}-${formality}`;
}

// Determine if a user's answer is correct, with some flexibility
export function checkAnswer(expected: string, actual: string): boolean {
    // Normalize both strings for comparison (trim whitespace, etc)
    const normalizedExpected = expected.trim();
    const normalizedActual = actual.trim();

    // Exact match
    if (normalizedExpected === normalizedActual) {
        return true;
    }

    // Optional: Implement more flexible matching if needed
    // For example, accepting different forms of writing certain characters

    return false;
} 