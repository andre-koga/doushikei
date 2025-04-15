import { writable, derived, get } from 'svelte/store';
import type { Polarity, Formality } from '$lib/verbs';
import { tenseOptions } from '$lib/verbs';
import { enabledTenses, enabledPolarities, enabledFormalities } from './preferenceStore';
import type { JapaneseVerb } from '$lib/types';
import { conjugator } from '$lib/conjugation';

// Game stats
export const score = writable<{ correct: number; total: number }>({ correct: 0, total: 0 });
export const attempts = writable(0);
export const tenseStats = writable<Record<string, { attempts: number; correct: number }>>({});

// Initialize stats for each tense
export const initTenseStats = () => {
	const stats: Record<string, { attempts: number; correct: number }> = {};
	tenseOptions.forEach((tense) => {
		stats[tense.id] = { attempts: 0, correct: 0 };
	});
	tenseStats.set(stats);
};

// Current game state
export const currentVerb = writable<JapaneseVerb | null>(null);
export const currentTense = writable<string>('present');
export const currentPolarity = writable<Polarity>('affirmative');
export const currentFormality = writable<Formality>('plain');
export const correctAnswer = writable('');
export const userAnswer = writable('');
export const convertedAnswer = writable('');
export const feedback = writable('');
export const isCorrect = writable<boolean>(false);
export const showAnswer = writable<boolean>(false);
export const remainingAttempts = writable(3);
export const currentAttempt = writable(0);

// Derived stores
export const totalTenseAttempts = derived(tenseStats, ($tenseStats) => {
	return Object.values($tenseStats).reduce((sum, stat) => sum + stat.attempts, 0);
});

// Performance tracking by tense
export const tensePerformance = writable<Record<string, { correct: number; total: number }>>({});

// Reset game stats
export function resetGame() {
	score.set({ correct: 0, total: 0 });
	attempts.set(0);
	initTenseStats();
	tensePerformance.set({});
	newQuestion();
}

// Get current tense from store
function getCurrentTense(): string {
	return get(currentTense);
}

// Helper function to get random item from array
function getRandomItem<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

// Generate a new question
export function newQuestion() {
	// Get a random verb
	const allVerbs = conjugator.getAllVerbs();
	const verb = allVerbs[Math.floor(Math.random() * allVerbs.length)];

	// Get current enabled options
	const enabledTensesValue = get(enabledTenses);
	const enabledPolaritiesValue = get(enabledPolarities);
	const enabledFormalitiesValue = get(enabledFormalities);

	// Get a random tense that isn't the dictionary form (present-affirmative-plain)
	let selectedTense: string;
	let selectedPolarity: Polarity;
	let selectedFormality: Formality;
	let isDictionaryForm: boolean;

	do {
		selectedTense = getRandomItem(enabledTensesValue);
		selectedPolarity = getRandomItem(enabledPolaritiesValue);
		selectedFormality = getRandomItem(enabledFormalitiesValue);

		// Check if this combination is the dictionary form
		isDictionaryForm =
			selectedTense === 'present' &&
			selectedPolarity === 'affirmative' &&
			selectedFormality === 'plain';

		// If only dictionary form is enabled, accept it
		if (
			isDictionaryForm &&
			enabledTensesValue.length === 1 &&
			enabledPolaritiesValue.length === 1 &&
			enabledFormalitiesValue.length === 1
		) {
			isDictionaryForm = false;
		}
	} while (isDictionaryForm);

	// Update the stores
	currentVerb.set(verb);
	currentTense.set(selectedTense);
	currentPolarity.set(selectedPolarity);
	currentFormality.set(selectedFormality);
	isCorrect.set(false);
	showAnswer.set(false);
}

// Calculate accuracy percentage for a tense
export function getTenseAccuracy(tenseId: string): number {
	let stats: Record<string, { attempts: number; correct: number }> = {};
	tenseStats.subscribe((value) => {
		stats = value;
	})();

	if (stats[tenseId]?.attempts === 0) return 0;
	return Math.round((stats[tenseId].correct / stats[tenseId].attempts) * 100);
}

// Check the answer
export function checkAnswer(userAnswer: string, expectedAnswer: string) {
	const correct = userAnswer.trim() === expectedAnswer.trim();
	isCorrect.set(correct);

	// Update score
	score.update((s) => ({
		correct: s.correct + (correct ? 1 : 0),
		total: s.total + 1
	}));

	// Update tense performance
	tensePerformance.update((tp) => {
		const tense = getCurrentTense();
		if (!tp[tense]) {
			tp[tense] = { correct: 0, total: 0 };
		}
		tp[tense].total++;
		if (correct) {
			tp[tense].correct++;
		}
		return tp;
	});
}

// Initialize stats
initTenseStats();
