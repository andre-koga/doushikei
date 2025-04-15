import type { Formality, Polarity, Tense, VerbEnding } from './types';
import { allVerbs } from './jlpt-verbs';

export interface Verb {
	dictionary: string; // Dictionary form
	kana: string; // Kana reading
	meaning: string; // English meaning
	type: 'godan' | 'ichidan' | 'irregular'; // Verb type
	// For godan verbs, what character the stem ends with
	ending?: VerbEnding;
	// For irregular verbs
	irregularForms?: Partial<Record<`${Tense}-${Polarity}-${Formality}`, string>>;
	regularPattern?: 'godan' | 'ichidan';
	transitivity?: 'transitive' | 'intransitive'; // Whether the verb takes a direct object
}

export interface TenseOption {
	id: Tense;
	label: string;
	description: string;
	essential: boolean;
	longDescription?: string; // Add detailed explanation of what the form is used for
	hasFormality: boolean; // Whether this tense has formality variations
	hasPolarity: boolean; // Whether this tense has polarity variations
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
		id: 'present',
		label: 'Present',
		description: '現在形',
		essential: true,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			"The present tense (dictionary form) is used to express habitual actions, general truths, and future events. It's the base form of Japanese verbs."
	},

	{
		id: 'past',
		label: 'Past',
		description: '過去形',
		essential: true,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			"The past tense indicates completed actions or states. It's formed by changing the end of the verb (-た form)."
	},

	{
		id: 'teForm',
		label: 'Te-form',
		description: 'て形',
		essential: true,
		hasFormality: false,
		hasPolarity: true,
		longDescription:
			'The te-form is a versatile connecting form used to link verbs, create requests, show ongoing actions, and form many compound verbs.'
	},

	{
		id: 'potential',
		label: 'Potential',
		description: '可能形',
		essential: true,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The potential form expresses the ability to do something ("can do"). It\'s formed differently for ichidan and godan verbs.'
	},

	{
		id: 'passive',
		label: 'Passive',
		description: '受身形',
		essential: false,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The passive form is used when the subject is being acted upon, similar to "is done" in English. It can also express adversity in Japanese.'
	},

	{
		id: 'causative',
		label: 'Causative',
		description: '使役形',
		essential: false,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The causative form expresses making or letting someone do something. It indicates permission or coercion.'
	},

	{
		id: 'imperative',
		label: 'Imperative',
		description: '命令形',
		essential: true,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The imperative form is used for commands or strong requests. The plain form is considered rude except among close friends. The negative form (prohibitive) is used to tell someone not to do something, with な being the plain form and ないでください being the polite form.'
	},

	{
		id: 'volitional',
		label: 'Volitional',
		description: '意向形',
		essential: true,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The volitional form expresses intention or invitation, similar to "let\'s" or "I will" in English. It\'s commonly used for suggesting activities.'
	},

	{
		id: 'conditionalBa',
		label: 'Conditional (Ba)',
		description: 'ば形',
		essential: false,
		hasFormality: false,
		hasPolarity: true,
		longDescription:
			'The ba-conditional expresses hypothetical conditions ("if X, then Y") and is used for general or natural consequences.'
	},

	{
		id: 'conditionalTara',
		label: 'Conditional (Tara)',
		description: 'たら形',
		essential: true,
		hasFormality: false,
		hasPolarity: true,
		longDescription:
			'The tara-conditional is used for "if/when" conditions with a sequential nuance. It\'s often used for unexpected discoveries or future uncertainties.'
	},

	{
		id: 'progressive',
		label: 'Progressive',
		description: 'ている形',
		essential: true,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The progressive form indicates ongoing actions or states. It combines the te-form with iru/imasu and can also show resultant states.'
	},

	{
		id: 'desire',
		label: 'Desire',
		description: 'たい形',
		essential: true,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			"The desire form expresses wants and wishes. It's formed by adding -tai to the verb stem and behaves like an i-adjective."
	},

	{
		id: 'causativePassive',
		label: 'Causative-Passive',
		description: '使役受身形',
		essential: false,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The causative-passive form indicates being made to do something, often with a nuance of inconvenience or annoyance.'
	},

	{
		id: 'conditionalNara',
		label: 'Conditional (Nara)',
		description: 'なら形',
		essential: false,
		hasFormality: false,
		hasPolarity: true,
		longDescription:
			'The nara-conditional is used for situational conditions ("if that\'s the case") and often refers to information just learned.'
	},

	{
		id: 'conditionalTo',
		label: 'Provisional (To)',
		description: 'と形',
		essential: false,
		hasFormality: false,
		hasPolarity: true,
		longDescription:
			'The to-conditional expresses automatic or natural results, like "if A happens, B will naturally follow." It cannot be used with commands or requests.'
	},

	{
		id: 'should',
		label: 'Should',
		description: 'べき形',
		essential: false,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The should form expresses moral or social obligation. It uses べき and is often translated as "should" or "ought to."'
	},

	{
		id: 'must',
		label: 'Must',
		description: 'なければならない形',
		essential: false,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The must form expresses necessity or obligation. It uses なければならない and indicates something that must be done.'
	},

	{
		id: 'attemptive',
		label: 'Attemptive',
		description: 'てみる形',
		essential: false,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The attemptive form expresses trying or attempting to do something. It combines the te-form with みる (to see/try).'
	},

	{
		id: 'preparatory',
		label: 'Preparatory',
		description: 'ておく形',
		essential: false,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The preparatory form expresses doing something in advance or preparation. It combines the te-form with おく (to put).'
	},

	{
		id: 'regrettable',
		label: 'Regrettable',
		description: 'てしまう形',
		essential: false,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The regrettable form expresses doing something completely or with regret. It combines the te-form with しまう (to finish).'
	},

	{
		id: 'giving',
		label: 'Giving',
		description: 'てあげる形',
		essential: false,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The giving form expresses doing something for someone else. It combines the te-form with あげる (to give).'
	},

	{
		id: 'receiving',
		label: 'Receiving',
		description: 'てもらう形',
		essential: false,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The receiving form expresses having someone do something for you. It combines the te-form with もらう (to receive).'
	},

	{
		id: 'receivingFavor',
		label: 'Receiving Favor',
		description: 'てくれる形',
		essential: false,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The receiving favor form expresses someone doing something for you. It combines the te-form with くれる (to give to me).'
	},

	{
		id: 'simultaneous',
		label: 'Simultaneous',
		description: 'ながら形',
		essential: false,
		hasFormality: false,
		hasPolarity: true,
		longDescription:
			'The simultaneous form expresses doing two actions at the same time. It attaches ながら to the verb stem (masu-stem).'
	},

	{
		id: 'purposeGoing',
		label: 'Purpose (Going)',
		description: 'に行く形',
		essential: false,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The purpose going form expresses going somewhere to do something. It combines the plain form with に行く (to go).'
	},

	{
		id: 'purposeComing',
		label: 'Purpose (Coming)',
		description: 'に来る形',
		essential: false,
		hasFormality: true,
		hasPolarity: true,
		longDescription:
			'The purpose coming form expresses coming somewhere to do something. It combines the plain form with に来る (to come).'
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

// Use the verb lists from jlpt-verbs
export const verbs: Verb[] = Object.values(allVerbs).flat();
