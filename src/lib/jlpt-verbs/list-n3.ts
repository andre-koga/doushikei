import type { JapaneseVerb } from '../types';

export const n3Verbs: JapaneseVerb[] = [
	{
		dictionary: '進める',
		kana: 'すすめる',
		meaning: 'to advance, to promote',
		type: 'ichidan',
		ending: 'ru',
		transitivity: 'transitive'
	},
	{
		dictionary: '進む',
		kana: 'すすむ',
		meaning: 'to advance, to progress',
		type: 'godan',
		ending: 'mu',
		transitivity: 'intransitive'
	},
	{
		dictionary: '決める',
		kana: 'きめる',
		meaning: 'to decide',
		type: 'ichidan',
		ending: 'ru',
		transitivity: 'transitive'
	},
	{
		dictionary: '決まる',
		kana: 'きまる',
		meaning: 'to be decided',
		type: 'godan',
		ending: 'ru',
		transitivity: 'intransitive'
	},
	{
		dictionary: '続ける',
		kana: 'つづける',
		meaning: 'to continue',
		type: 'ichidan',
		ending: 'ru',
		transitivity: 'transitive'
	},
	{
		dictionary: '続く',
		kana: 'つづく',
		meaning: 'to continue',
		type: 'godan',
		ending: 'ku',
		transitivity: 'intransitive'
	},
	{
		dictionary: '調べる',
		kana: 'しらべる',
		meaning: 'to investigate',
		type: 'ichidan',
		ending: 'ru',
		transitivity: 'transitive'
	},
	{
		dictionary: '比べる',
		kana: 'くらべる',
		meaning: 'to compare',
		type: 'ichidan',
		ending: 'ru',
		transitivity: 'transitive'
	},
	{
		dictionary: '伝える',
		kana: 'つたえる',
		meaning: 'to convey',
		type: 'ichidan',
		ending: 'ru',
		transitivity: 'transitive'
	},
	{
		dictionary: '伝わる',
		kana: 'つたわる',
		meaning: 'to be transmitted',
		type: 'godan',
		ending: 'ru',
		transitivity: 'intransitive'
	}
];
