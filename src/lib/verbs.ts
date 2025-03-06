export interface Verb {
    dictionary: string;  // Dictionary form
    kana: string;      // Kana reading
    meaning: string;   // English meaning
    type: 'godan' | 'ichidan' | 'irregular';  // Verb type
    // For godan verbs, what character the stem ends with
    ending?: 'u' | 'ku' | 'gu' | 'su' | 'tsu' | 'nu' | 'bu' | 'mu' | 'ru';
    // For irregular verbs
    irregularForms?: Record<string, string>;
}

export interface ConjugationOption {
    id: string;
    label: string;
    description: string;
}

export const tenseOptions: ConjugationOption[] = [
    { id: 'present', label: 'Present (Non-past)', description: '現在形' },
    { id: 'past', label: 'Past', description: '過去形' },
    { id: 'teForm', label: 'Te-form', description: 'て形' },
    { id: 'potential', label: 'Potential', description: '可能形' },
    { id: 'passive', label: 'Passive', description: '受身形' },
    { id: 'causative', label: 'Causative', description: '使役形' },
    { id: 'imperative', label: 'Imperative', description: '命令形' },
    { id: 'volitional', label: 'Volitional', description: '意向形' },
];

export const polarityOptions: ConjugationOption[] = [
    { id: 'affirmative', label: 'Affirmative', description: '肯定' },
    { id: 'negative', label: 'Negative', description: '否定' },
];

export const formalityOptions: ConjugationOption[] = [
    { id: 'plain', label: 'Plain (だ/である)', description: '普通形' },
    { id: 'polite', label: 'Polite (です/ます)', description: '丁寧形' },
];

// Sample verb list
export const verbs: Verb[] = [
    {
        dictionary: '食べる',
        kana: 'たべる',
        meaning: 'to eat',
        type: 'ichidan',
    },
    {
        dictionary: '飲む',
        kana: 'のむ',
        meaning: 'to drink',
        type: 'godan',
        ending: 'mu',
    },
    {
        dictionary: '行く',
        kana: 'いく',
        meaning: 'to go',
        type: 'godan',
        ending: 'ku',
    },
    {
        dictionary: '来る',
        kana: 'くる',
        meaning: 'to come',
        type: 'irregular',
        irregularForms: {
            'past-affirmative-plain': 'きた',
            'past-negative-plain': 'こなかった',
            'teForm-affirmative-plain': 'きて',
        },
    },
    {
        dictionary: '見る',
        kana: 'みる',
        meaning: 'to see, to look',
        type: 'ichidan',
    },
    {
        dictionary: '話す',
        kana: 'はなす',
        meaning: 'to speak',
        type: 'godan',
        ending: 'su',
    },
    {
        dictionary: '書く',
        kana: 'かく',
        meaning: 'to write',
        type: 'godan',
        ending: 'ku',
    },
    {
        dictionary: '読む',
        kana: 'よむ',
        meaning: 'to read',
        type: 'godan',
        ending: 'mu',
    },
    {
        dictionary: '泳ぐ',
        kana: 'およぐ',
        meaning: 'to swim',
        type: 'godan',
        ending: 'gu',
    },
    {
        dictionary: '買う',
        kana: 'かう',
        meaning: 'to buy',
        type: 'godan',
        ending: 'u',
    },
]; 