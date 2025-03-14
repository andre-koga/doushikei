/**
 * Verb Utilities
 *
 * This module provides functions for working with the Japanese verb list.
 * It includes utilities for searching, filtering, conjugating, and presenting verbs.
 */

import verbData from './verb-data.json';

/**
 * Returns the entire verb list
 */
export function getAllVerbs() {
	return verbData;
}

/**
 * Get a specific number of verbs from the list
 * @param {number} count - Number of verbs to return
 * @param {number} offset - Starting position (for pagination)
 */
export function getVerbs(count = 10, offset = 0) {
	return verbData.slice(offset, offset + count);
}

/**
 * Search for verbs by various criteria
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Array} - Matching verbs
 */
export function searchVerbs(query, options = {}) {
	const {
		field = 'all', // 'dictionary', 'kana', 'meaning', or 'all'
		maxResults = 20,
		exactMatch = false
	} = options;

	if (!query) return [];

	const lowerQuery = query.toLowerCase();

	return verbData
		.filter((verb) => {
			if (field === 'dictionary' || field === 'all') {
				if (exactMatch) {
					if (verb.dictionary === query) return true;
				} else {
					if (verb.dictionary.includes(query)) return true;
				}
			}

			if (field === 'kana' || field === 'all') {
				if (exactMatch) {
					if (verb.kana === query) return true;
				} else {
					if (verb.kana.includes(query)) return true;
				}
			}

			if (field === 'meaning' || field === 'all') {
				if (verb.meaning.toLowerCase().includes(lowerQuery)) return true;
			}

			return false;
		})
		.slice(0, maxResults);
}

/**
 * Get verbs by type
 * @param {string} type - 'ichidan', 'godan', or 'irregular'
 */
export function getVerbsByType(type) {
	return verbData.filter((verb) => verb.type === type);
}

/**
 * Get random verbs for practice
 * @param {number} count - Number of random verbs to return
 * @param {Object} options - Filter options
 */
export function getRandomVerbs(count = 10, options = {}) {
	const {
		type = null, // Filter by verb type if provided
		excludeIds = [] // Array of verbs to exclude
	} = options;

	let filteredVerbs = [...verbData];

	if (type) {
		filteredVerbs = filteredVerbs.filter((verb) => verb.type === type);
	}

	if (excludeIds.length > 0) {
		filteredVerbs = filteredVerbs.filter((verb) => !excludeIds.includes(verb.dictionary));
	}

	// Shuffle the array
	const shuffled = filteredVerbs.sort(() => 0.5 - Math.random());

	return shuffled.slice(0, count);
}

/**
 * Convert a verb to its masu form
 * @param {Object} verb - The verb object
 * @returns {string} - The masu form
 */
export function getMasuForm(verb) {
	const { dictionary, kana, type } = verb;

	if (type === 'ichidan') {
		// For ichidan verbs, remove る and add ます
		return kana.slice(0, -1) + 'ます';
	} else if (type === 'godan') {
		// For godan verbs, convert the last character to its i-row equivalent and add ます
		const lastChar = kana.slice(-1);
		const stem = kana.slice(0, -1);

		// Convert u-row to i-row
		const uToIMap = {
			う: 'い',
			く: 'き',
			ぐ: 'ぎ',
			す: 'し',
			つ: 'ち',
			ぬ: 'に',
			ぶ: 'び',
			む: 'み',
			る: 'り'
		};

		return stem + uToIMap[lastChar] + 'ます';
	} else if (type === 'irregular') {
		// Handle irregular verbs
		if (dictionary === 'する' || dictionary === '為る') {
			return 'します';
		} else if (dictionary === '来る' || dictionary === 'くる') {
			return 'きます';
		}
	}

	return kana; // Return original if conversion failed
}

/**
 * Get te-form of a verb
 * @param {Object} verb - The verb object
 * @returns {string} - The te-form
 */
export function getTeForm(verb) {
	const { dictionary, kana, type } = verb;

	if (type === 'ichidan') {
		// For ichidan verbs, remove る and add て
		return kana.slice(0, -1) + 'て';
	} else if (type === 'godan') {
		const lastChar = kana.slice(-1);
		const stem = kana.slice(0, -1);

		// Different rules based on the last character
		if (['う', 'つ', 'る'].includes(lastChar)) {
			return stem + 'って';
		} else if (['む', 'ぶ', 'ぬ'].includes(lastChar)) {
			return stem + 'んで';
		} else if (lastChar === 'く') {
			return stem + 'いて';
		} else if (lastChar === 'ぐ') {
			return stem + 'いで';
		} else if (lastChar === 'す') {
			return stem + 'して';
		}
	} else if (type === 'irregular') {
		if (dictionary === 'する' || dictionary === '為る') {
			return 'して';
		} else if (dictionary === '来る' || dictionary === 'くる') {
			return 'きて';
		}
	}

	return kana; // Return original if conversion failed
}

/**
 * Get the negative form of a verb
 * @param {Object} verb - The verb object
 * @returns {string} - The negative form
 */
export function getNegativeForm(verb) {
	const { dictionary, kana, type } = verb;

	if (type === 'ichidan') {
		// For ichidan verbs, remove る and add ない
		return kana.slice(0, -1) + 'ない';
	} else if (type === 'godan') {
		// For godan verbs, convert the last character to its a-row equivalent and add ない
		const lastChar = kana.slice(-1);
		const stem = kana.slice(0, -1);

		// Convert u-row to a-row
		const uToAMap = {
			う: 'わ',
			く: 'か',
			ぐ: 'が',
			す: 'さ',
			つ: 'た',
			ぬ: 'な',
			ぶ: 'ば',
			む: 'ま',
			る: 'ら'
		};

		return stem + uToAMap[lastChar] + 'ない';
	} else if (type === 'irregular') {
		if (dictionary === 'する' || dictionary === '為る') {
			return 'しない';
		} else if (dictionary === '来る' || dictionary === 'くる') {
			return 'こない';
		}
	}

	return kana; // Return original if conversion failed
}

/**
 * Create flashcards from verb list
 * @param {Array} verbs - List of verbs to convert to flashcards
 * @param {Object} options - Options for flashcard creation
 */
export function createFlashcards(verbs, options = {}) {
	const {
		format = 'standard', // 'standard', 'meaning-to-japanese', 'japanese-to-meaning'
		includeConjugations = false
	} = options;

	return verbs.map((verb) => {
		const { dictionary, kana, meaning, type } = verb;

		let flashcard = {
			id: dictionary,
			type
		};

		if (format === 'standard' || format === 'japanese-to-meaning') {
			flashcard.front = `${dictionary} (${kana})`;
			flashcard.back = meaning;
		} else {
			flashcard.front = meaning;
			flashcard.back = `${dictionary} (${kana})`;
		}

		if (includeConjugations) {
			flashcard.conjugations = {
				masu: getMasuForm(verb),
				te: getTeForm(verb),
				negative: getNegativeForm(verb)
			};
		}

		return flashcard;
	});
}

/**
 * Group verbs by type for statistics
 */
export function getVerbStats() {
	const stats = {
		total: verbData.length,
		byType: {
			ichidan: 0,
			godan: 0,
			irregular: 0
		},
		byEnding: {}
	};

	verbData.forEach((verb) => {
		// Count by type
		stats.byType[verb.type]++;

		// Count by ending (for godan verbs)
		if (verb.type === 'godan' && verb.ending) {
			stats.byEnding[verb.ending] = (stats.byEnding[verb.ending] || 0) + 1;
		}
	});

	return stats;
}
