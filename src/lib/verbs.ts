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
    longDescription?: string; // Add detailed explanation of what the form is used for
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
    {
        id: 'present', label: 'Present', description: '現在形', essential: true,
        longDescription: 'The present tense (dictionary form) is used to express habitual actions, general truths, and future events. It\'s the base form of Japanese verbs.'
    },

    {
        id: 'past', label: 'Past', description: '過去形', essential: true,
        longDescription: 'The past tense indicates completed actions or states. It\'s formed by changing the end of the verb (-た form).'
    },

    {
        id: 'teForm', label: 'Te-form', description: 'て形', essential: true,
        longDescription: 'The te-form is a versatile connecting form used to link verbs, create requests, show ongoing actions, and form many compound verbs.'
    },

    {
        id: 'potential', label: 'Potential', description: '可能形', essential: true,
        longDescription: 'The potential form expresses the ability to do something ("can do"). It\'s formed differently for ichidan and godan verbs.'
    },

    {
        id: 'passive', label: 'Passive', description: '受身形', essential: false,
        longDescription: 'The passive form is used when the subject is being acted upon, similar to "is done" in English. It can also express adversity in Japanese.'
    },

    {
        id: 'causative', label: 'Causative', description: '使役形', essential: false,
        longDescription: 'The causative form expresses making or letting someone do something. It indicates permission or coercion.'
    },

    {
        id: 'imperative', label: 'Imperative', description: '命令形', essential: false,
        longDescription: 'The imperative form is used for commands or strong requests. The plain form is considered rude except among close friends.'
    },

    {
        id: 'volitional', label: 'Volitional', description: '意向形', essential: true,
        longDescription: 'The volitional form expresses intention or invitation, similar to "let\'s" or "I will" in English. It\'s commonly used for suggesting activities.'
    },

    {
        id: 'conditionalBa', label: 'Conditional (Ba)', description: 'ば形', essential: true,
        longDescription: 'The ba-conditional expresses hypothetical conditions ("if X, then Y") and is used for general or natural consequences.'
    },

    {
        id: 'conditionalTara', label: 'Conditional (Tara)', description: 'たら形', essential: true,
        longDescription: 'The tara-conditional is used for "if/when" conditions with a sequential nuance. It\'s often used for unexpected discoveries or future uncertainties.'
    },

    {
        id: 'progressive', label: 'Progressive', description: 'ている形', essential: true,
        longDescription: 'The progressive form indicates ongoing actions or states. It combines the te-form with iru/imasu and can also show resultant states.'
    },

    {
        id: 'desire', label: 'Desire', description: 'たい形', essential: true,
        longDescription: 'The desire form expresses wants and wishes. It\'s formed by adding -tai to the verb stem and behaves like an i-adjective.'
    },

    {
        id: 'causativePassive', label: 'Causative-Passive', description: '使役受身形', essential: false,
        longDescription: 'The causative-passive form indicates being made to do something, often with a nuance of inconvenience or annoyance.'
    },

    {
        id: 'conditionalNara', label: 'Conditional (Nara)', description: 'なら形', essential: false,
        longDescription: 'The nara-conditional is used for situational conditions ("if that\'s the case") and often refers to information just learned.'
    },

    {
        id: 'conditionalTo', label: 'Provisional (To)', description: 'と形', essential: false,
        longDescription: 'The to-conditional expresses automatic or natural results, like "if A happens, B will naturally follow." It cannot be used with commands or requests.'
    },

    {
        id: 'should', label: 'Should', description: 'べき形', essential: false,
        longDescription: 'The "should" form expresses obligation or proper behavior. It\'s more formal than other ways of expressing obligation.'
    },

    {
        id: 'must', label: 'Must', description: 'なければならない形', essential: false,
        longDescription: 'The "must" form expresses necessity or obligation. We allow the two most used forms: なければならない (plain) and なければなりません (polite). Both are acceptable and mean "if you don\'t do X, it won\'t work/be acceptable."'
    },

    {
        id: 'attemptive', label: 'Attemptive', description: 'てみる形', essential: false,
        longDescription: 'The attemptive form expresses trying or attempting an action. It uses te-form + みる (to see) to say "try doing" something.'
    },

    {
        id: 'preparatory', label: 'Preparatory', description: 'ておく形', essential: false,
        longDescription: 'The preparatory form indicates doing something in advance or preparation. It combines the te-form with おく (to put) to show foresight.'
    },

    {
        id: 'regrettable', label: 'Regrettable', description: 'てしまう形', essential: false,
        longDescription: 'The regrettable form expresses actions done completely, often with a nuance of regret or finality. It can show unintentional or unfortunate actions.'
    },

    {
        id: 'giving', label: 'Giving', description: 'てあげる形', essential: false,
        longDescription: 'The giving form expresses doing something for someone else\'s benefit. It shows the action is done as a favor to someone else.'
    },

    {
        id: 'receiving', label: 'Receiving', description: 'てくれる形', essential: false,
        longDescription: 'The receiving form expresses someone doing something for your benefit. It shows appreciation for actions done for you.'
    },

    {
        id: 'receivingFavor', label: 'Receiving Favor', description: 'てもらう形', essential: false,
        longDescription: 'The receiving favor form indicates receiving the favor of someone\'s action. It emphasizes the receiver\'s viewpoint of getting someone to do something.'
    },

    {
        id: 'simultaneous', label: 'Simultaneous', description: 'ながら形', essential: true,
        longDescription: 'The simultaneous form expresses doing two actions at the same time. It\'s similar to "while doing" in English.'
    },

    {
        id: 'purposeGoing', label: 'Purpose (Going)', description: 'に行く形', essential: true,
        longDescription: 'The purpose going form expresses going somewhere to do something. It shows movement with a specific purpose in mind.'
    },

    {
        id: 'purposeComing', label: 'Purpose (Coming)', description: 'に来る形', essential: true,
        longDescription: 'The purpose coming form expresses coming somewhere to do something. It shows movement toward the speaker with a specific purpose.'
    }
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
