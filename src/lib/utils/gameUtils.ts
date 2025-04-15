import { verbs, type Verb } from '$lib/verbs';
import { checkAnswer as checkConjugationAnswer } from '$lib/conjugation';
import { romajiToJapanese, isRomaji } from '$lib/romaji';
import {
	score,
	attempts,
	currentTense,
	tenseStats,
	currentAttempt,
	remainingAttempts,
	isCorrect,
	showAnswer,
	feedback,
	userAnswer,
	convertedAnswer,
	correctAnswer
} from '$lib/stores/gameStore';

// Get a random verb from our list
export function getRandomVerb(): Verb {
	const randomIndex = Math.floor(Math.random() * verbs.length);
	return verbs[randomIndex];
}

// Get a random option from an enabled list
export function getRandomOption<T>(options: T[], enabledOptions: T[]): T {
	// If no options are enabled, enable all options
	if (enabledOptions.length === 0) {
		return options[Math.floor(Math.random() * options.length)];
	}

	// Otherwise, select randomly from enabled options
	const randomIndex = Math.floor(Math.random() * enabledOptions.length);
	return enabledOptions[randomIndex];
}

// Function to check if text contains kanji characters
export function hasKanji(text: string): boolean {
	// Check for kanji characters (CJK Unified Ideographs)
	return /[\u4e00-\u9faf]/.test(text);
}

// Function to get hiragana version of the answer if it contains kanji
export function getHiraganaVersion(text: string): string | null {
	// This is a simplified function to show the hiragana reading
	// for verbs we know. In a real app, you might use a more comprehensive
	// kanji-to-hiragana conversion or get it from the verb data

	// Map common kanji in our verbs to hiragana
	const kanjiMap: Record<string, string> = {
		行: 'い',
		来: 'く',
		食: 'た',
		飲: 'の',
		見: 'み',
		読: 'よ',
		書: 'か',
		話: 'はな',
		買: 'か'
	};

	if (!hasKanji(text)) return null;

	let result = text;
	Object.entries(kanjiMap).forEach(([kanji, hiragana]) => {
		result = result.replaceAll(kanji, hiragana);
	});

	return result !== text ? result : null;
}

// Process user input for romaji conversion
export function processInput(input: string, useRomajiInput: boolean): string {
	if (useRomajiInput && isRomaji(input)) {
		return romajiToJapanese(input);
	} else {
		return input;
	}
}

// Check the user's answer and update stats
export function checkUserAnswer(useRomajiInput: boolean): void {
	let userAnswerValue = '';
	let correctAnswerValue = '';
	let convertedAnswerValue = '';
	let currentTenseValue: string;
	let currentAttemptValue = 0;

	// Get current values from stores
	userAnswer.subscribe((value) => {
		userAnswerValue = value;
	})();
	correctAnswer.subscribe((value) => {
		correctAnswerValue = value;
	})();
	currentTense.subscribe((value) => {
		currentTenseValue = value;
	})();
	currentAttempt.subscribe((value) => {
		currentAttemptValue = value;
	})();

	if (!userAnswerValue.trim()) return;

	// Increment attempt counters
	attempts.update((n) => n + 1);
	currentAttempt.update((n) => n + 1);
	currentAttemptValue += 1;

	// Only track stats on first attempt for this question
	if (currentAttemptValue === 1) {
		// Update tense stats
		tenseStats.update((stats) => {
			if (stats[currentTenseValue]) {
				stats[currentTenseValue].attempts += 1;
			}
			return stats;
		});
	}

	// Process input first in case it's romaji
	convertedAnswerValue = processInput(userAnswerValue, useRomajiInput);
	convertedAnswer.set(convertedAnswerValue);

	// Check if the converted answer is correct
	if (checkConjugationAnswer(correctAnswerValue, convertedAnswerValue)) {
		feedback.set('正解！ (Correct!)');
		isCorrect.set(true);
		score.update((n) => ({ correct: n.correct + 1, total: n.total + 1 }));

		// Only increment correct stat on first attempt
		if (currentAttemptValue === 1) {
			tenseStats.update((stats) => {
				if (stats[currentTenseValue]) {
					stats[currentTenseValue].correct += 1;
				}
				return stats;
			});
		}
	} else {
		remainingAttempts.update((n) => n - 1);
		let remainingAttemptsValue = 0;
		remainingAttempts.subscribe((value) => {
			remainingAttemptsValue = value;
		})();

		if (remainingAttemptsValue > 0) {
			feedback.set(
				`不正解 (Incorrect) - ${remainingAttemptsValue} ${remainingAttemptsValue === 1 ? 'attempt' : 'attempts'} remaining`
			);
			// Clear the input for next attempt
			userAnswer.set('');
			convertedAnswer.set('');
		} else {
			feedback.set('不正解 (Incorrect)');
			isCorrect.set(false);
			// Automatically show the answer after three incorrect attempts
			showAnswer.set(true);
		}
	}
}

// Get color class based on accuracy percentage
export function getAccuracyColorClass(accuracy: number): string {
	if (accuracy === 0) return 'bg-gray-700'; // No attempts yet
	if (accuracy >= 90) return 'bg-emerald-800';
	if (accuracy >= 70) return 'bg-green-700';
	if (accuracy >= 50) return 'bg-yellow-700';

	return 'bg-red-800';
}
