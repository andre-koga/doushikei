import type { JapaneseVerb } from '../types';

export const n5Verbs: JapaneseVerb[] = [
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
        irregularForms: {
            'present-affirmative-plain': '来る',
            'present-affirmative-polite': '来ます',
            'present-negative-plain': '来ない',
            'present-negative-polite': '来ません'
        }
    },
    {
        dictionary: '見る',
        kana: 'みる',
        meaning: 'to see, to look',
        type: 'ichidan'
    },
    {
        dictionary: '聞く',
        kana: 'きく',
        meaning: 'to listen, to ask',
        type: 'godan',
        ending: 'ku'
    },
    {
        dictionary: '話す',
        kana: 'はなす',
        meaning: 'to speak',
        type: 'godan',
        ending: 'su'
    },
    {
        dictionary: '読む',
        kana: 'よむ',
        meaning: 'to read',
        type: 'godan',
        ending: 'mu'
    },
    {
        dictionary: '書く',
        kana: 'かく',
        meaning: 'to write',
        type: 'godan',
        ending: 'ku'
    },
    {
        dictionary: '買う',
        kana: 'かう',
        meaning: 'to buy',
        type: 'godan',
        ending: 'u'
    }
]; 