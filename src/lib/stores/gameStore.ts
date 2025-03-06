import { writable, derived } from 'svelte/store';
import type { Verb, Tense, Polarity, Formality } from '$lib/verbs';
import { conjugateVerb } from '$lib/conjugation';
import { getRandomVerb, getRandomOption } from '$lib/utils/gameUtils';
import { tenseOptions } from '$lib/verbs';
import { enabledTenses, enabledPolarities, enabledFormalities } from './preferenceStore';

// Game stats
export const score = writable(0);
export const attempts = writable(0);
export const tenseStats = writable<Record<string, { attempts: number, correct: number }>>({});

// Initialize stats for each tense
export const initTenseStats = () => {
    const stats: Record<string, { attempts: number, correct: number }> = {};
    tenseOptions.forEach((tense) => {
        stats[tense.id] = { attempts: 0, correct: 0 };
    });
    tenseStats.set(stats);
};

// Current game state
export const currentVerb = writable<Verb | null>(null);
export const currentTense = writable<Tense>('present');
export const currentPolarity = writable<Polarity>('affirmative');
export const currentFormality = writable<Formality>('plain');
export const correctAnswer = writable('');
export const userAnswer = writable('');
export const convertedAnswer = writable('');
export const feedback = writable('');
export const isCorrect = writable(false);
export const showAnswer = writable(false);
export const remainingAttempts = writable(3);
export const currentAttempt = writable(0);

// Derived stores
export const totalTenseAttempts = derived(tenseStats, $tenseStats => {
    return Object.values($tenseStats).reduce((sum, stat) => sum + stat.attempts, 0);
});

// Reset game stats
export const resetGame = () => {
    score.set(0);
    attempts.set(0);
    initTenseStats();
    newQuestion();
};

// Generate a new question
export const newQuestion = () => {
    // Reset question state
    userAnswer.set('');
    convertedAnswer.set('');
    feedback.set('');
    isCorrect.set(false);
    showAnswer.set(false);
    currentAttempt.set(0);
    remainingAttempts.set(3);

    let verbValue: Verb;
    let tenseValue: Tense;
    let polarityValue: Polarity;
    let formalityValue: Formality;
    let enabledTensesValue: Tense[];
    let enabledPolaritiesValue: Polarity[];
    let enabledFormalitiesValue: Formality[];

    // Get current values from stores (we need to do this synchronously)
    enabledTenses.subscribe(value => { enabledTensesValue = value; })();
    enabledPolarities.subscribe(value => { enabledPolaritiesValue = value; })();
    enabledFormalities.subscribe(value => { enabledFormalitiesValue = value; })();

    // Get a random verb
    verbValue = getRandomVerb();
    currentVerb.set(verbValue);

    // Keep generating new combinations until we get one that isn't the dictionary form
    let isDictionaryForm = true;
    while (isDictionaryForm) {
        // Select random conjugation options from enabled lists
        tenseValue = getRandomOption(
            tenseOptions.map((t) => t.id),
            enabledTensesValue
        );
        polarityValue = getRandomOption(
            ['affirmative', 'negative'] as Polarity[],
            enabledPolaritiesValue
        );
        formalityValue = getRandomOption(
            ['plain', 'polite'] as Formality[],
            enabledFormalitiesValue
        );

        // Skip the dictionary form (present affirmative plain)
        isDictionaryForm =
            tenseValue === 'present' &&
            polarityValue === 'affirmative' &&
            formalityValue === 'plain';

        // If only present-affirmative-plain is enabled, we need to escape this loop
        if (
            isDictionaryForm &&
            enabledTensesValue.length === 1 &&
            enabledTensesValue[0] === 'present' &&
            enabledPolaritiesValue.length === 1 &&
            enabledPolaritiesValue[0] === 'affirmative' &&
            enabledFormalitiesValue.length === 1 &&
            enabledFormalitiesValue[0] === 'plain'
        ) {
            isDictionaryForm = false; // Accept the dictionary form if it's the only option
        }
    }

    // Update stores with selected options
    currentTense.set(tenseValue);
    currentPolarity.set(polarityValue);
    currentFormality.set(formalityValue);

    // Compute the correct answer
    if (verbValue) {
        correctAnswer.set(conjugateVerb(verbValue, tenseValue, polarityValue, formalityValue));
    }
};

// Calculate accuracy percentage for a tense
export const getTenseAccuracy = (tenseId: string): number => {
    let stats: Record<string, { attempts: number, correct: number }> = {};
    tenseStats.subscribe(value => { stats = value; })();

    if (stats[tenseId]?.attempts === 0) return 0;
    return Math.round((stats[tenseId].correct / stats[tenseId].attempts) * 100);
};

// Initialize stats
initTenseStats(); 