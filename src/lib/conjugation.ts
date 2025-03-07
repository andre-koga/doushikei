import type { Formality, Polarity, Tense, Verb } from './verbs';

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
	u: {
		a: 'わ',
		i: 'い',
		e: 'え',
		o: 'お',
		te: 'って'
	},
	ku: {
		a: 'か',
		i: 'き',
		e: 'け',
		o: 'こ',
		te: 'いて'
	},
	gu: {
		a: 'が',
		i: 'ぎ',
		e: 'げ',
		o: 'ご',
		te: 'いで'
	},
	su: {
		a: 'さ',
		i: 'し',
		e: 'せ',
		o: 'そ',
		te: 'して'
	},
	tsu: {
		a: 'た',
		i: 'ち',
		e: 'て',
		o: 'と',
		te: 'って'
	},
	nu: {
		a: 'な',
		i: 'に',
		e: 'ね',
		o: 'の',
		te: 'んで'
	},
	bu: {
		a: 'ば',
		i: 'び',
		e: 'べ',
		o: 'ぼ',
		te: 'んで'
	},
	mu: {
		a: 'ま',
		i: 'み',
		e: 'め',
		o: 'も',
		te: 'んで'
	},
	ru: {
		a: 'ら',
		i: 'り',
		e: 'れ',
		o: 'ろ',
		te: 'って'
	}
};

// Function to conjugate verbs based on tense, polarity and formality
export function conjugateVerb(
	verb: Verb,
	tense: Tense,
	polarity: Polarity = 'affirmative',
	formality: Formality = 'plain'
): string {
	// For irregular verbs, check if we have a pre-defined form
	const formKey = `${tense}-${polarity}-${formality}` as `${Tense}-${Polarity}-${Formality}`;
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
		case 'conditionalBa':
			return conjugateConditionalBa(verb, polarity, formality);
		case 'conditionalTara':
			return conjugateConditionalTara(verb, polarity, formality);
		case 'progressive':
			return conjugateProgressive(verb, polarity, formality);
		case 'desire':
			return conjugateDesire(verb, polarity, formality);
		case 'causativePassive':
			return conjugateCausativePassive(verb, polarity, formality);
		case 'conditionalNara':
			return conjugateConditionalNara(verb, polarity, formality);
		case 'conditionalTo':
			return conjugateConditionalTo(verb, polarity, formality);
		case 'should':
			return conjugateShould(verb, polarity, formality);
		case 'must':
			return conjugateMust(verb, polarity, formality);
		case 'attemptive':
			return conjugateAttemptive(verb, polarity, formality);
		case 'preparatory':
			return conjugatePreparatory(verb, polarity, formality);
		case 'regrettable':
			return conjugateRegrettable(verb, polarity, formality);
		case 'giving':
			return conjugateGiving(verb, polarity, formality);
		case 'receiving':
			return conjugateReceiving(verb, polarity, formality);
		case 'receivingFavor':
			return conjugateReceivingFavor(verb, polarity, formality);
		case 'simultaneous':
			return conjugateSimultaneous(verb, polarity, formality);
		case 'purposeGoing':
			return conjugatePurposeGoing(verb, polarity, formality);
		case 'purposeComing':
			return conjugatePurposeComing(verb, polarity, formality);
		default:
			return verb.dictionary; // Default to dictionary form
	}
}

// Present tense conjugation
function conjugatePresent(verb: Verb, polarity: string, formality: string): string {
	if (polarity === 'affirmative') {
		if (formality === 'plain') {
			return verb.dictionary; // Dictionary form is present plain affirmative
		} else {
			// Polite form
			if (verb.type === 'ichidan') {
				return getVerbStem(verb) + 'ます';
			} else if (verb.type === 'godan' && verb.ending) {
				const stem = getGodanConsonantStem(verb);
				return stem + godanConjugationMap[verb.ending]['i'] + 'ます';
			}
		}
	} else {
		// Negative
		if (formality === 'plain') {
			if (verb.type === 'ichidan') {
				return getVerbStem(verb) + 'ない';
			} else if (verb.type === 'godan' && verb.ending) {
				const stem = getGodanConsonantStem(verb);
				return stem + godanConjugationMap[verb.ending]['a'] + 'ない';
			}
		} else {
			// Polite negative
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
		} else {
			// Polite past affirmative
			if (verb.type === 'ichidan') {
				return getVerbStem(verb) + 'ました';
			} else if (verb.type === 'godan' && verb.ending) {
				const stem = getGodanConsonantStem(verb);
				return stem + godanConjugationMap[verb.ending]['i'] + 'ました';
			}
		}
	} else {
		// Negative past
		if (formality === 'plain') {
			if (verb.type === 'ichidan') {
				return getVerbStem(verb) + 'なかった';
			} else if (verb.type === 'godan' && verb.ending) {
				const stem = getGodanConsonantStem(verb);
				return stem + godanConjugationMap[verb.ending]['a'] + 'なかった';
			}
		} else {
			// Polite negative past
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
	} else {
		// Negative te-form (usually using なくて)
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
		} else {
			// Polite
			return potentialBase + 'ます';
		}
	} else {
		// Negative
		if (formality === 'plain') {
			return potentialBase + 'ない';
		} else {
			// Polite
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
		} else {
			// Polite
			return passiveBase + 'ます';
		}
	} else {
		// Negative
		if (formality === 'plain') {
			return passiveBase + 'ない';
		} else {
			// Polite
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
		} else {
			// Polite
			return causativeBase + 'ます';
		}
	} else {
		// Negative
		if (formality === 'plain') {
			return causativeBase + 'ない';
		} else {
			// Polite
			return causativeBase + 'ません';
		}
	}
}

// Imperative form conjugation (simplified)
function conjugateImperative(verb: Verb, polarity: string, formality: string): string {
	if (polarity === 'affirmative') {
		if (formality === 'plain') {
			// Plain command (harsh)
			if (verb.type === 'ichidan') {
				return getVerbStem(verb) + 'ろ';
			} else if (verb.type === 'godan' && verb.ending) {
				const stem = getGodanConsonantStem(verb);
				return stem + godanConjugationMap[verb.ending]['e'];
			}
		} else {
			// Polite imperative (using te kudasai)
			return conjugateTeForm(verb, 'affirmative') + ' ください';
		}
	} else {
		// Negative command
		if (formality === 'plain') {
			return conjugatePresent(verb, 'affirmative', 'plain') + 'な';
		} else {
			// Polite negative imperative
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
		} else {
			// Polite volitional
			if (verb.type === 'ichidan') {
				return getVerbStem(verb) + 'ましょう';
			} else if (verb.type === 'godan' && verb.ending) {
				const stem = getGodanConsonantStem(verb);
				return stem + godanConjugationMap[verb.ending]['i'] + 'ましょう';
			}
		}
	} else {
		// Negative volitional (not common, using other constructions)
		if (formality === 'plain') {
			return conjugatePresent(verb, 'negative', 'plain') + 'だろう';
		} else {
			// Polite
			return conjugatePresent(verb, 'negative', 'polite') + 'でしょう';
		}
	}
	return verb.dictionary; // Fallback
}

// Handle special irregular verbs like する and 来る
function conjugateIrregularVerb(
	verb: Verb,
	tense: Tense,
	polarity: Polarity,
	formality: Formality
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
		// Cases for 来る
		if (tense === 'present') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来る' : '来ます';
			} else {
				return formality === 'plain' ? '来ない' : '来ません';
			}
		} else if (tense === 'past') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来た' : '来ました';
			} else {
				return formality === 'plain' ? '来なかった' : '来ませんでした';
			}
		} else if (tense === 'teForm') {
			return polarity === 'affirmative' ? '来て' : '来なくて';
		} else if (tense === 'potential') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来られる' : '来られます';
			} else {
				return formality === 'plain' ? '来られない' : '来られません';
			}
		} else if (tense === 'passive') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来られる' : '来られます';
			} else {
				return formality === 'plain' ? '来られない' : '来られません';
			}
		} else if (tense === 'causative') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来させる' : '来させます';
			} else {
				return formality === 'plain' ? '来させない' : '来させません';
			}
		} else if (tense === 'imperative') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来い' : '来てください';
			} else {
				return formality === 'plain' ? '来るな' : '来ないでください';
			}
		} else if (tense === 'volitional') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来よう' : '来ましょう';
			} else {
				return formality === 'plain' ? '来まい' : '来ないでしょう';
			}
		} else if (tense === 'conditionalBa') {
			if (polarity === 'affirmative') {
				return '来れば';
			} else {
				return '来なければ';
			}
		} else if (tense === 'conditionalTara') {
			if (polarity === 'affirmative') {
				return '来たら';
			} else {
				return '来なかったら';
			}
		} else if (tense === 'progressive') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来ている' : '来ています';
			} else {
				return formality === 'plain' ? '来ていない' : '来ていません';
			}
		} else if (tense === 'desire') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来たい' : '来たいです';
			} else {
				return formality === 'plain' ? '来たくない' : '来たくないです';
			}
		} else if (tense === 'causativePassive') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来させられる' : '来させられます';
			} else {
				return formality === 'plain' ? '来させられない' : '来させられません';
			}
		} else if (tense === 'conditionalNara') {
			if (polarity === 'affirmative') {
				return '来るなら';
			} else {
				return '来ないなら';
			}
		} else if (tense === 'conditionalTo') {
			if (polarity === 'affirmative') {
				return '来ると';
			} else {
				return '来ないと';
			}
		} else if (tense === 'should') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来るべき' : '来るべきです';
			} else {
				return formality === 'plain' ? '来るべきではない' : '来るべきではありません';
			}
		} else if (tense === 'must') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来なければならない' : '来なければなりません';
			} else {
				return formality === 'plain' ? '来なくてもいい' : '来なくてもいいです';
			}
		} else if (tense === 'attemptive') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来てみる' : '来てみます';
			} else {
				return formality === 'plain' ? '来てみない' : '来てみません';
			}
		} else if (tense === 'preparatory') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来ておく' : '来ておきます';
			} else {
				return formality === 'plain' ? '来ておかない' : '来ておきません';
			}
		} else if (tense === 'regrettable') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来てしまう' : '来てしまいます';
			} else {
				return formality === 'plain' ? '来てしまわない' : '来てしまいません';
			}
		} else if (tense === 'giving') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来てあげる' : '来てあげます';
			} else {
				return formality === 'plain' ? '来てあげない' : '来てあげません';
			}
		} else if (tense === 'receiving') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来てくれる' : '来てくれます';
			} else {
				return formality === 'plain' ? '来てくれない' : '来てくれません';
			}
		} else if (tense === 'receivingFavor') {
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来てもらう' : '来てもらいます';
			} else {
				return formality === 'plain' ? '来てもらわない' : '来てもらいません';
			}
		} else if (tense === 'simultaneous') {
			if (polarity === 'affirmative') {
				return '来ながら';
			} else {
				return '来ないで';
			}
		} else if (tense === 'purposeGoing') {
			// This is a special case: "coming to come" doesn't make much sense
			// So we'll use a different pattern
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来るために行く' : '来るために行きます';
			} else {
				return formality === 'plain' ? '来るために行かない' : '来るために行きません';
			}
		} else if (tense === 'purposeComing') {
			// This is also a special case: "coming to come" is redundant
			// So we'll use a clearer expression
			if (polarity === 'affirmative') {
				return formality === 'plain' ? '来るために来る' : '来るために来ます';
			} else {
				return formality === 'plain' ? '来るために来ない' : '来るために来ません';
			}
		}
	}

	// Default fallback - try normal conjugation rules
	return conjugateVerb({ ...verb, type: 'ichidan' }, tense, polarity, formality);
}

// Generate a conjugation pattern key for caching and lookup
export function getConjugationKey(tense: string, polarity: string, formality: string): string {
	return `${tense}-${polarity}-${formality}`;
}

// Helper function to convert kanji to hiragana (for known verb patterns)
function toHiragana(text: string): string {
	// Common kanji-to-hiragana mappings in verb conjugations
	const kanjiToHiragana: Record<string, string> = {
		// Numbers and common kanji in verbs
		一: 'いち',
		二: 'に',
		三: 'さん',
		四: 'よん',
		五: 'ご',
		六: 'ろく',
		七: 'なな',
		八: 'はち',
		九: 'きゅう',
		十: 'じゅう',
		百: 'ひゃく',
		千: 'せん',
		万: 'まん',

		// Common verb-related kanji
		行: 'い',
		来: 'く',
		食: 'た',
		飲: 'の',
		見: 'み',
		読: 'よ',
		書: 'か',
		話: 'はな',
		買: 'か',
		売: 'う',
		泳: 'およ',
		走: 'はし',
		座: 'すわ',
		立: 'た',
		歩: 'ある',
		寝: 'ね',
		起: 'お',
		開: 'あ',
		閉: 'し',
		出: 'で',
		入: 'はい',
		登: 'のぼ',
		降: 'お',
		使: 'つか',
		持: 'も',
		待: 'ま',
		知: 'し',
		思: 'おも',
		考: 'かんが',
		言: 'い',
		聞: 'き',
		教: 'おし',
		始: 'はじ',
		終: 'お',
		死: 'し',
		生: 'い',
		働: 'はたら',
		休: 'やす',
		遊: 'あそ',
		学: 'まな'
	};

	// Replace kanji with hiragana
	let result = text;

	// Apply each substitution
	Object.entries(kanjiToHiragana).forEach(([kanji, hiragana]) => {
		result = result.replaceAll(kanji, hiragana);
	});

	return result;
}

// Determine if a user's answer is correct, with some flexibility
export function checkAnswer(expected: string, actual: string): boolean {
	// Normalize both strings for comparison (trim whitespace, remove spaces, etc)
	const normalizedExpected = expected.trim().replace(/\s+/g, '');
	const normalizedActual = actual.trim().replace(/\s+/g, '');

	// Exact match
	if (normalizedExpected === normalizedActual) {
		return true;
	}

	// Handle the "must" form (なければならない/なければなりません) specifically
	// Accept either form regardless of which one was expected
	if (
		normalizedExpected.endsWith('なければならない') ||
		normalizedExpected.endsWith('なければなりません')
	) {
		// Extract the verb part (everything before なければ)
		const verbPartExpected = normalizedExpected.replace(
			/(なければならない|なければなりません)$/,
			''
		);
		const verbPartActual = normalizedActual.replace(/(なければならない|なければなりません)$/, '');

		// If the verb parts match, and the ending is either form of "must"
		if (
			verbPartExpected === verbPartActual &&
			(normalizedActual.endsWith('なければならない') ||
				normalizedActual.endsWith('なければなりません'))
		) {
			return true;
		}

		// Also try using hiragana conversion for more flexibility
		const hiraganaExpected = toHiragana(normalizedExpected);
		const hiraganaActual = toHiragana(normalizedActual);

		const hiraganaVerbPartExpected = hiraganaExpected.replace(
			/(なければならない|なければなりません)$/,
			''
		);
		const hiraganaVerbPartActual = hiraganaActual.replace(
			/(なければならない|なければなりません)$/,
			''
		);

		// Check the hiragana versions
		if (
			hiraganaVerbPartExpected === hiraganaVerbPartActual &&
			(hiraganaActual.endsWith('なければならない') || hiraganaActual.endsWith('なければなりません'))
		) {
			return true;
		}
	}

	// Also check if the actual answer is either form and expected is the other form
	if (
		(normalizedExpected.endsWith('なければならない') &&
			normalizedActual.endsWith('なければなりません')) ||
		(normalizedExpected.endsWith('なければなりません') &&
			normalizedActual.endsWith('なければならない'))
	) {
		// Extract and compare the verb parts
		const verbPartExpected = normalizedExpected.replace(
			/(なければならない|なければなりません)$/,
			''
		);
		const verbPartActual = normalizedActual.replace(/(なければならない|なければなりません)$/, '');

		if (verbPartExpected === verbPartActual) {
			return true;
		}
	}

	// Convert both to hiragana for more flexible matching
	const hiraganaExpected = toHiragana(normalizedExpected);
	const hiraganaActual = toHiragana(normalizedActual);

	// Additional check for "must" form with more variations
	// This handles potential romaji input variations and other common patterns
	if (hiraganaExpected.includes('なければ') || hiraganaActual.includes('なければ')) {
		// Common variations of the endings
		const mustEndings = [
			'なければならない',
			'なければなりません',
			'なければいけない',
			'なければいけません',
			'なければだめ',
			'なければだめです'
		];

		// Check if either the expected or actual answer uses any of these endings
		const hasExpectedMustEnding = mustEndings.some((ending) => hiraganaExpected.endsWith(ending));
		const hasActualMustEnding = mustEndings.some((ending) => hiraganaActual.endsWith(ending));

		if (hasExpectedMustEnding && hasActualMustEnding) {
			// Get the verb stem part (everything before なければ)
			const verbPartExpected = hiraganaExpected.split('なければ')[0];
			const verbPartActual = hiraganaActual.split('なければ')[0];

			if (verbPartExpected === verbPartActual) {
				return true;
			}
		}
	}

	// Check if the hiragana versions match
	if (hiraganaExpected === hiraganaActual) {
		return true;
	}

	// More flexible matching for alternative spelling variants

	// Handle long vowel mark (ー) alternatives
	const longVowelExpected = normalizedExpected.replace(/([あいうえお])ー/g, '$1$1');
	const longVowelActual = normalizedActual.replace(/([あいうえお])ー/g, '$1$1');

	if (longVowelExpected === longVowelActual) {
		return true;
	}

	// Try the same with hiragana versions
	const longVowelHiraganaExpected = hiraganaExpected.replace(/([あいうえお])ー/g, '$1$1');
	const longVowelHiraganaActual = hiraganaActual.replace(/([あいうえお])ー/g, '$1$1');

	if (longVowelHiraganaExpected === longVowelHiraganaActual) {
		return true;
	}

	// Handle small tsu (っ) variations in typing
	const smallTsuExpected = normalizedExpected.replace(/っ([kstpcgzjdbfr])/g, '$1$1');
	const smallTsuActual = normalizedActual.replace(/っ([kstpcgzjdbfr])/g, '$1$1');

	if (smallTsuExpected === smallTsuActual) {
		return true;
	}

	// Try the same with hiragana versions
	const smallTsuHiraganaExpected = hiraganaExpected.replace(/っ([kstpcgzjdbfr])/g, '$1$1');
	const smallTsuHiraganaActual = hiraganaActual.replace(/っ([kstpcgzjdbfr])/g, '$1$1');

	if (smallTsuHiraganaExpected === smallTsuHiraganaActual) {
		return true;
	}

	// Handle common particle variations (は/わ, へ/え, を/お)
	const particleExpected = longVowelExpected
		.replace(/は/g, 'わ')
		.replace(/へ/g, 'え')
		.replace(/を/g, 'お');

	const particleActual = longVowelActual
		.replace(/は/g, 'わ')
		.replace(/へ/g, 'え')
		.replace(/を/g, 'お');

	if (particleExpected === particleActual) {
		return true;
	}

	// Try the same with hiragana versions
	const particleHiraganaExpected = longVowelHiraganaExpected
		.replace(/は/g, 'わ')
		.replace(/へ/g, 'え')
		.replace(/を/g, 'お');

	const particleHiraganaActual = longVowelHiraganaActual
		.replace(/は/g, 'わ')
		.replace(/へ/g, 'え')
		.replace(/を/g, 'お');

	if (particleHiraganaExpected === particleHiraganaActual) {
		return true;
	}

	return false;
}

// Conditional Ba-form conjugation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function conjugateConditionalBa(verb: Verb, polarity: string, _formality: string): string {
	if (polarity === 'affirmative') {
		if (verb.type === 'ichidan') {
			return getVerbStem(verb) + 'れば';
		} else if (verb.type === 'godan' && verb.ending) {
			const stem = getGodanConsonantStem(verb);
			return stem + godanConjugationMap[verb.ending]['e'] + 'ば';
		}
	} else {
		// Negative ba-form
		if (verb.type === 'ichidan') {
			return getVerbStem(verb) + 'なければ';
		} else if (verb.type === 'godan' && verb.ending) {
			const stem = getGodanConsonantStem(verb);
			return stem + godanConjugationMap[verb.ending]['a'] + 'なければ';
		}
	}
	return verb.dictionary; // Fallback
}

// Conditional Tara-form conjugation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function conjugateConditionalTara(verb: Verb, polarity: string, _formality: string): string {
	// Tara form is based on the past tense + ら
	const pastForm = conjugatePast(verb, polarity, 'plain');
	return pastForm + 'ら';
}

// Progressive form conjugation (te-form + iru/imasu)
function conjugateProgressive(verb: Verb, polarity: string, formality: string): string {
	const teForm = conjugateTeForm(verb, 'affirmative');

	if (polarity === 'affirmative') {
		if (formality === 'plain') {
			return teForm + 'いる';
		} else {
			return teForm + 'います';
		}
	} else {
		// Negative progressive
		if (formality === 'plain') {
			return teForm + 'いない';
		} else {
			return teForm + 'いません';
		}
	}
}

// Desire form conjugation (stem + tai/tagaru)
function conjugateDesire(verb: Verb, polarity: string, formality: string): string {
	let base = '';

	if (verb.type === 'ichidan') {
		base = getVerbStem(verb);
	} else if (verb.type === 'godan' && verb.ending) {
		const stem = getGodanConsonantStem(verb);
		base = stem + godanConjugationMap[verb.ending]['i'];
	}

	if (polarity === 'affirmative') {
		if (formality === 'plain') {
			return base + 'たい';
		} else {
			return base + 'たいです';
		}
	} else {
		// Negative desire
		if (formality === 'plain') {
			return base + 'たくない';
		} else {
			return base + 'たくないです';
		}
	}
}

// Causative-Passive form conjugation
function conjugateCausativePassive(verb: Verb, polarity: string, formality: string): string {
	let base = '';

	if (verb.type === 'ichidan') {
		base = getVerbStem(verb) + 'させられ';
	} else if (verb.type === 'godan' && verb.ending) {
		const stem = getGodanConsonantStem(verb);
		base = stem + godanConjugationMap[verb.ending]['a'] + 'せられ';
	}

	if (polarity === 'affirmative') {
		if (formality === 'plain') {
			return base + 'る';
		} else {
			return base + 'ます';
		}
	} else {
		// Negative causative-passive
		if (formality === 'plain') {
			return base + 'ない';
		} else {
			return base + 'ません';
		}
	}
}

// Conditional Nara-form conjugation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function conjugateConditionalNara(verb: Verb, polarity: string, _formality: string): string {
	const dictionaryForm = conjugatePresent(verb, polarity, 'plain');
	return dictionaryForm + 'なら';
}

// Conditional To-form conjugation (provisional)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function conjugateConditionalTo(verb: Verb, polarity: string, _formality: string): string {
	const dictionaryForm = conjugatePresent(verb, polarity, 'plain');
	return dictionaryForm + 'と';
}

// Should form conjugation (-べき)
function conjugateShould(verb: Verb, polarity: string, formality: string): string {
	let base = '';

	if (verb.type === 'ichidan') {
		base = getVerbStem(verb);
	} else if (verb.type === 'godan' && verb.ending) {
		const stem = getGodanConsonantStem(verb);
		base = stem + godanConjugationMap[verb.ending]['u']; // Using the u-row for べき
	}

	if (polarity === 'affirmative') {
		const shoudForm = base + 'べき';
		return formality === 'plain' ? shoudForm : shoudForm + 'です';
	} else {
		// Negative form using "should not"
		const negForm = base + 'べきでは';
		return formality === 'plain' ? negForm + 'ない' : negForm + 'ありません';
	}
}

// Must form conjugation (-なければならない)
function conjugateMust(verb: Verb, polarity: string, formality: string): string {
	// For "must" form we use the negative conditional + ならない/なりません
	if (polarity === 'affirmative') {
		const negCond = conjugateConditionalBa(verb, 'negative', 'plain');
		return formality === 'plain' ? negCond + 'ならない' : negCond + 'なりません';
	} else {
		// For "don't have to" form
		const negCond = conjugateConditionalBa(verb, 'negative', 'plain');
		return formality === 'plain' ? negCond + 'なくてもいい' : negCond + 'なくてもいいです';
	}
}

// Attemptive form conjugation (-てみる)
function conjugateAttemptive(verb: Verb, polarity: string, formality: string): string {
	const teForm = conjugateTeForm(verb, 'affirmative');

	if (polarity === 'affirmative') {
		if (formality === 'plain') {
			return teForm + 'みる';
		} else {
			return teForm + 'みます';
		}
	} else {
		// Negative "try doing"
		if (formality === 'plain') {
			return teForm + 'みない';
		} else {
			return teForm + 'みません';
		}
	}
}

// Preparatory form conjugation (-ておく)
function conjugatePreparatory(verb: Verb, polarity: string, formality: string): string {
	const teForm = conjugateTeForm(verb, 'affirmative');

	if (polarity === 'affirmative') {
		if (formality === 'plain') {
			return teForm + 'おく';
		} else {
			return teForm + 'おきます';
		}
	} else {
		// Negative "do in advance"
		if (formality === 'plain') {
			return teForm + 'おかない';
		} else {
			return teForm + 'おきません';
		}
	}
}

// Regrettable form conjugation (-てしまう)
function conjugateRegrettable(verb: Verb, polarity: string, formality: string): string {
	const teForm = conjugateTeForm(verb, 'affirmative');

	if (polarity === 'affirmative') {
		if (formality === 'plain') {
			return teForm + 'しまう';
		} else {
			return teForm + 'しまいます';
		}
	} else {
		// Negative "completely do"
		if (formality === 'plain') {
			return teForm + 'しまわない';
		} else {
			return teForm + 'しまいません';
		}
	}
}

// Giving form conjugation (-てあげる)
function conjugateGiving(verb: Verb, polarity: string, formality: string): string {
	const teForm = conjugateTeForm(verb, 'affirmative');

	if (polarity === 'affirmative') {
		if (formality === 'plain') {
			return teForm + 'あげる';
		} else {
			return teForm + 'あげます';
		}
	} else {
		// Negative "do for someone"
		if (formality === 'plain') {
			return teForm + 'あげない';
		} else {
			return teForm + 'あげません';
		}
	}
}

// Receiving form conjugation (-てくれる)
function conjugateReceiving(verb: Verb, polarity: string, formality: string): string {
	const teForm = conjugateTeForm(verb, 'affirmative');

	if (polarity === 'affirmative') {
		if (formality === 'plain') {
			return teForm + 'くれる';
		} else {
			return teForm + 'くれます';
		}
	} else {
		// Negative "someone does for you"
		if (formality === 'plain') {
			return teForm + 'くれない';
		} else {
			return teForm + 'くれません';
		}
	}
}

// Receiving Favor form conjugation (-てもらう)
function conjugateReceivingFavor(verb: Verb, polarity: string, formality: string): string {
	const teForm = conjugateTeForm(verb, 'affirmative');

	if (polarity === 'affirmative') {
		if (formality === 'plain') {
			return teForm + 'もらう';
		} else {
			return teForm + 'もらいます';
		}
	} else {
		// Negative "receive the action from someone"
		if (formality === 'plain') {
			return teForm + 'もらわない';
		} else {
			return teForm + 'もらいません';
		}
	}
}

// Simultaneous action form conjugation (-ながら)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function conjugateSimultaneous(verb: Verb, polarity: string, _formality: string): string {
	let stem = '';

	if (verb.type === 'ichidan') {
		stem = getVerbStem(verb);
	} else if (verb.type === 'godan' && verb.ending) {
		const consonantStem = getGodanConsonantStem(verb);
		stem = consonantStem + godanConjugationMap[verb.ending]['i'];
	}

	if (polarity === 'affirmative') {
		return stem + 'ながら';
	} else {
		// There isn't really a negative for ながら, but we'll create a suitable alternative
		return stem + 'ないで';
	}
}

// Purpose Going form conjugation (-に行く)
function conjugatePurposeGoing(verb: Verb, polarity: string, formality: string): string {
	let stem = '';

	if (verb.type === 'ichidan') {
		stem = getVerbStem(verb);
	} else if (verb.type === 'godan' && verb.ending) {
		const consonantStem = getGodanConsonantStem(verb);
		stem = consonantStem + godanConjugationMap[verb.ending]['i'];
	}

	const baseForm = stem + 'に';

	if (polarity === 'affirmative') {
		if (formality === 'plain') {
			return baseForm + '行く';
		} else {
			return baseForm + '行きます';
		}
	} else {
		// Negative "go to do"
		if (formality === 'plain') {
			return baseForm + '行かない';
		} else {
			return baseForm + '行きません';
		}
	}
}

// Purpose Coming form conjugation (-に来る)
function conjugatePurposeComing(verb: Verb, polarity: string, formality: string): string {
	let stem = '';

	if (verb.type === 'ichidan') {
		stem = getVerbStem(verb);
	} else if (verb.type === 'godan' && verb.ending) {
		const consonantStem = getGodanConsonantStem(verb);
		stem = consonantStem + godanConjugationMap[verb.ending]['i'];
	}

	const baseForm = stem + 'に';

	if (polarity === 'affirmative') {
		if (formality === 'plain') {
			return baseForm + '来る';
		} else {
			return baseForm + '来ます';
		}
	} else {
		// Negative "come to do"
		if (formality === 'plain') {
			return baseForm + '来ない';
		} else {
			return baseForm + '来ません';
		}
	}
}
