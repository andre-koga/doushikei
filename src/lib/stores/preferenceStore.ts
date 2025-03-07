import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Tense, Polarity, Formality } from '$lib/verbs';
import { tenseOptions, polarityOptions, formalityOptions } from '$lib/verbs';

// Default preferences
const defaultTenses = tenseOptions.map((t) => t.id);
const defaultPolarities = polarityOptions.map((p) => p.id);
const defaultFormalities = formalityOptions.map((f) => f.id);
const defaultRomaji = true;

// Create stores with default values
export const enabledTenses = writable<Tense[]>(defaultTenses);
export const enabledPolarities = writable<Polarity[]>(defaultPolarities);
export const enabledFormalities = writable<Formality[]>(defaultFormalities);
export const useRomaji = writable<boolean>(defaultRomaji);

// Load preferences from localStorage
export const loadPreferences = () => {
	if (!browser) return;

	try {
		const savedPreferences = localStorage.getItem('verbConjugationPreferences');
		if (savedPreferences) {
			const preferences = JSON.parse(savedPreferences);

			// Restore tense selections (ensuring at least one is selected)
			if (preferences.enabledTenses && preferences.enabledTenses.length > 0) {
				enabledTenses.set(preferences.enabledTenses);
			}

			// Restore polarity selections
			if (preferences.enabledPolarities && preferences.enabledPolarities.length > 0) {
				enabledPolarities.set(preferences.enabledPolarities);
			}

			// Restore formality selections
			if (preferences.enabledFormalities && preferences.enabledFormalities.length > 0) {
				enabledFormalities.set(preferences.enabledFormalities);
			}

			// Restore romaji mode setting
			if (preferences.useRomaji !== undefined) {
				useRomaji.set(preferences.useRomaji);
			}
		}
	} catch (error) {
		console.error('Error loading preferences:', error);
		// If there's an error, we'll just use the default settings
	}
};

// Save preferences to localStorage
export const savePreferences = () => {
	if (!browser) return;

	try {
		let tenseValues: Tense[] = [];
		let polarityValues: Polarity[] = [];
		let formalityValues: Formality[] = [];
		let romajiValue = defaultRomaji;

		// Get current values from stores
		enabledTenses.subscribe((value) => {
			tenseValues = value;
		})();
		enabledPolarities.subscribe((value) => {
			polarityValues = value;
		})();
		enabledFormalities.subscribe((value) => {
			formalityValues = value;
		})();
		useRomaji.subscribe((value) => {
			romajiValue = value;
		})();

		const preferences = {
			enabledTenses: tenseValues,
			enabledPolarities: polarityValues,
			enabledFormalities: formalityValues,
			useRomaji: romajiValue
		};

		localStorage.setItem('verbConjugationPreferences', JSON.stringify(preferences));
	} catch (error) {
		console.error('Error saving preferences:', error);
	}
};

// Toggle functions
export const toggleTense = (tenseId: Tense) => {
	enabledTenses.update((tenses) => {
		if (tenses.includes(tenseId)) {
			// Remove if already included
			const newTenses = tenses.filter((id) => id !== tenseId);
			// Ensure at least one option is selected
			return newTenses.length === 0 ? [tenseId] : newTenses;
		} else {
			// Add if not included
			return [...tenses, tenseId];
		}
	});
	savePreferences();
};

export const togglePolarity = (polarityId: Polarity) => {
	enabledPolarities.update((polarities) => {
		if (polarities.includes(polarityId)) {
			// Remove if already included
			const newPolarities = polarities.filter((id) => id !== polarityId);
			// Ensure at least one option is selected
			return newPolarities.length === 0 ? [polarityId] : newPolarities;
		} else {
			// Add if not included
			return [...polarities, polarityId];
		}
	});
	savePreferences();
};

export const toggleFormality = (formalityId: Formality) => {
	enabledFormalities.update((formalities) => {
		if (formalities.includes(formalityId)) {
			// Remove if already included
			const newFormalities = formalities.filter((id) => id !== formalityId);
			// Ensure at least one option is selected
			return newFormalities.length === 0 ? [formalityId] : newFormalities;
		} else {
			// Add if not included
			return [...formalities, formalityId];
		}
	});
	savePreferences();
};

export const toggleAllTenses = (enable: boolean) => {
	enabledTenses.set(enable ? tenseOptions.map((t) => t.id) : [tenseOptions[0].id]);
	savePreferences();
};

export const toggleEssentialTenses = (enable: boolean) => {
	const essentialTenses = tenseOptions.filter((t) => t.essential).map((t) => t.id);
	enabledTenses.set(enable ? essentialTenses : [essentialTenses[0]]);
	savePreferences();
};

export const toggleAllPolarities = (enable: boolean) => {
	enabledPolarities.set(enable ? polarityOptions.map((p) => p.id) : [polarityOptions[0].id]);
	savePreferences();
};

export const toggleAllFormalities = (enable: boolean) => {
	enabledFormalities.set(enable ? formalityOptions.map((f) => f.id) : [formalityOptions[0].id]);
	savePreferences();
};

export const toggleRomajiMode = () => {
	useRomaji.update((value) => !value);
	savePreferences();
};
