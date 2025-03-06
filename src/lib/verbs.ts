export interface Verb {
    dictionary: string; // Dictionary form
    kana: string; // Kana reading
    meaning: string; // English meaning
    type: 'godan' | 'ichidan' | 'irregular'; // Verb type
    // For godan verbs, what character the stem ends with
    ending?: 'u' | 'ku' | 'gu' | 'su' | 'tsu' | 'nu' | 'bu' | 'mu' | 'ru';
    // For irregular verbs
    irregularForms?: Record<`${Tense}-${Polarity}-${Formality}`, string>;
}

export type Tense = 'present' | 'past' | 'teForm' | 'potential' | 'passive' | 'causative' | 'imperative' | 'volitional' | 'conditionalBa' | 'conditionalTara' | 'progressive' | 'desire' | 'causativePassive' | 'conditionalNara' | 'conditionalTo' | 'should' | 'must' | 'attemptive' | 'preparatory' | 'regrettable' | 'giving' | 'receiving' | 'receivingFavor' | 'simultaneous' | 'purposeGoing' | 'purposeComing';
export type Polarity = 'affirmative' | 'negative';
export type Formality = 'plain' | 'polite';

export interface TenseOption {
    id: Tense;
    label: string;
    description: string;
    essential: boolean;
}

export interface PolarityOption {
    id: Polarity;
    label: string;
    description: string;
}

export interface FormalityOption {
    id: Formality;
    label: string;
    description: string;
}

export const tenseOptions: TenseOption[] = [
    { id: 'present', label: 'Present', description: '現在形', essential: true },
    { id: 'past', label: 'Past', description: '過去形', essential: true },
    { id: 'teForm', label: 'Te-form', description: 'て形', essential: true },
    { id: 'potential', label: 'Potential', description: '可能形', essential: true },
    { id: 'passive', label: 'Passive', description: '受身形', essential: false },
    { id: 'causative', label: 'Causative', description: '使役形', essential: false },
    { id: 'imperative', label: 'Imperative', description: '命令形', essential: false },
    { id: 'volitional', label: 'Volitional', description: '意向形', essential: true },
    { id: 'conditionalBa', label: 'Conditional (Ba)', description: 'ば形', essential: false },
    { id: 'conditionalTara', label: 'Conditional (Tara)', description: 'たら形', essential: true },
    { id: 'progressive', label: 'Progressive', description: 'ている形', essential: true },
    { id: 'desire', label: 'Desire', description: 'たい形', essential: true },
    { id: 'causativePassive', label: 'Causative-Passive', description: '使役受身形', essential: false },
    { id: 'conditionalNara', label: 'Conditional (Nara)', description: 'なら形', essential: false },
    { id: 'conditionalTo', label: 'Provisional (To)', description: 'と形', essential: false },
    { id: 'should', label: 'Should', description: 'べき形', essential: false },
    { id: 'must', label: 'Must', description: 'なければならない形', essential: false },
    { id: 'attemptive', label: 'Attemptive', description: 'てみる形', essential: false },
    { id: 'preparatory', label: 'Preparatory', description: 'ておく形', essential: false },
    { id: 'regrettable', label: 'Regrettable', description: 'てしまう形', essential: false },
    { id: 'giving', label: 'Giving', description: 'てあげる形', essential: false },
    { id: 'receiving', label: 'Receiving', description: 'てくれる形', essential: false },
    { id: 'receivingFavor', label: 'Receiving Favor', description: 'てもらう形', essential: false },
    { id: 'simultaneous', label: 'Simultaneous', description: 'ながら形', essential: false },
    { id: 'purposeGoing', label: 'Purpose (Going)', description: 'に行く形', essential: false },
    { id: 'purposeComing', label: 'Purpose (Coming)', description: 'に来る形', essential: false }
];

export const polarityOptions: PolarityOption[] = [
    { id: 'affirmative', label: 'Affirmative', description: '肯定' },
    { id: 'negative', label: 'Negative', description: '否定' }
];

export const formalityOptions: FormalityOption[] = [
    { id: 'plain', label: 'Plain', description: '普通形' },
    { id: 'polite', label: 'Polite', description: '丁寧形' }
];

// Sample verb list
export const verbs: Verb[] = [
    {
        dictionary: '食べる',
        kana: 'たべる',
        meaning: 'to eat',
        type: 'ichidan'
    },
    {
        dictionary: '飲む',
        kana: 'のむ',
        meaning: 'to drink',
        type: 'godan',
        ending: 'mu'
    },
    {
        dictionary: '行く',
        kana: 'いく',
        meaning: 'to go',
        type: 'godan',
        ending: 'ku'
    },
    {
        dictionary: '来る',
        kana: 'くる',
        meaning: 'to come',
        type: 'irregular',
        // irregularForms: {
        //     'present-affirmative-plain': 'くる',
        //     'present-negative-plain': 'こない',
        //     'past-affirmative-plain': 'きた',
        //     'past-negative-plain': 'こなかった',
        //     'teForm-affirmative-plain': 'きて',
        //     'teForm-negative-plain': 'きない',
        //     'potential-affirmative-plain': 'くれる',
        //     'potential-negative-plain': 'くれない',
        //     'passive-affirmative-plain': 'きられる',
        //     'passive-negative-plain': 'きられない',
        //     'causative-affirmative-plain': 'きさせる',
        // }
    },
    {
        dictionary: '見る',
        kana: 'みる',
        meaning: 'to see, to look',
        type: 'ichidan'
    },
    {
        dictionary: '話す',
        kana: 'はなす',
        meaning: 'to speak',
        type: 'godan',
        ending: 'su'
    },
    {
        dictionary: '書く',
        kana: 'かく',
        meaning: 'to write',
        type: 'godan',
        ending: 'ku'
    },
    {
        dictionary: '読む',
        kana: 'よむ',
        meaning: 'to read',
        type: 'godan',
        ending: 'mu'
    },
    {
        dictionary: '泳ぐ',
        kana: 'およぐ',
        meaning: 'to swim',
        type: 'godan',
        ending: 'gu'
    },
    {
        dictionary: '買う',
        kana: 'かう',
        meaning: 'to buy',
        type: 'godan',
        ending: 'u'
    }
];
