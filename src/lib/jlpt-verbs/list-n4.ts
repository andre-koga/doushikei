import type { JapaneseVerb } from '../types';

export const n4Verbs: JapaneseVerb[] = [
	{
		dictionary: '始める',
		kana: 'はじめる',
		meaning: 'to begin',
		type: 'ichidan',
		ending: 'ru',
		transitivity: 'transitive'
	},
	{
		dictionary: '終わる',
		kana: 'おわる',
		meaning: 'to end',
		type: 'godan',
		ending: 'ru',
		transitivity: 'transitive'
	},
	{
		dictionary: '教える',
		kana: 'おしえる',
		meaning: 'to teach',
		type: 'ichidan',
		ending: 'ru',
		transitivity: 'transitive'
	},
	{
		dictionary: '習う',
		kana: 'ならう',
		meaning: 'to learn',
		type: 'godan',
		ending: 'u',
		transitivity: 'intransitive'
	},
	{
		dictionary: '考える',
		kana: 'かんがえる',
		meaning: 'to think',
		type: 'ichidan',
		ending: 'ru',
		transitivity: 'intransitive'
	},
	{
		dictionary: '作る',
		kana: 'つくる',
		meaning: 'to make',
		type: 'godan',
		ending: 'ru',
		transitivity: 'transitive'
	},
	{
		dictionary: '使う',
		kana: 'つかう',
		meaning: 'to use',
		type: 'godan',
		ending: 'u',
		transitivity: 'transitive'
	},
	{
		dictionary: '待つ',
		kana: 'まつ',
		meaning: 'to wait',
		type: 'godan',
		ending: 'tsu',
		transitivity: 'intransitive'
	},
	{
		dictionary: '持つ',
		kana: 'もつ',
		meaning: 'to hold',
		type: 'godan',
		ending: 'tsu',
		transitivity: 'intransitive'
	},
	{
		dictionary: '知る',
		kana: 'しる',
		meaning: 'to know',
		type: 'godan',
		ending: 'ru',
		transitivity: 'intransitive'
	}
];
