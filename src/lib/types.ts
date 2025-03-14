export interface JapaneseVerb {
    dictionary: string;
    kana: string;
    meaning: string;
    type: 'godan' | 'ichidan' | 'irregular';
    ending?: string;
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