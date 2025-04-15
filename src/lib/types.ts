export interface JapaneseVerb {
    dictionary: string;
    kana: string;
    meaning: string;
    type: 'godan' | 'ichidan' | 'irregular';
    ending?: VerbEnding;
    irregularForms?: Record<string, string>;
}

export interface ConjugationRule {
    appliesTo: string[];
    transform: (verb: JapaneseVerb) => string;
}

export type ConjugationForm =
    | 'present'
    | 'past'
    | 'te'
    | 'negative'
    | 'potential'
    | 'passive'
    | 'causative'
    | 'imperative';

export type Tense =
    | 'present'
    | 'past'
    | 'teForm'
    | 'potential'
    | 'passive'
    | 'causative'
    | 'imperative'
    | 'volitional'
    | 'conditionalBa'
    | 'conditionalTara'
    | 'progressive'
    | 'desire'
    | 'causativePassive'
    | 'conditionalNara'
    | 'conditionalTo'
    | 'should'
    | 'must'
    | 'attemptive'
    | 'preparatory'
    | 'regrettable'
    | 'giving'
    | 'receiving'
    | 'receivingFavor'
    | 'simultaneous'
    | 'purposeGoing'
    | 'purposeComing';

export type Polarity = 'affirmative' | 'negative';

export type Formality = 'plain' | 'polite';

export type VerbEnding = 'u' | 'ku' | 'gu' | 'su' | 'tsu' | 'nu' | 'bu' | 'mu' | 'ru';

export type SoundChange = 'a' | 'i' | 'e' | 'o' | 'te';