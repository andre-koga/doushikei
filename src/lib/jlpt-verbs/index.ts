export * from './list-n5';
export * from './list-n4';
export * from './list-n3';
export * from './list-n2';
export * from './list-n1';

import { n5Verbs } from './list-n5';
import { n4Verbs } from './list-n4';
import { n3Verbs } from './list-n3';
import { n2Verbs } from './list-n2';
import { n1Verbs } from './list-n1';
import type { Verb } from '$lib/verbs';

// Sort helper function to ensure all verb lists are alphabetically sorted by dictionary form
function sortVerbs(verbs: Verb[]) {
	return [...verbs].sort((a, b) => a.dictionary.localeCompare(b.dictionary));
}

// Export consistently sorted verb lists
export const allVerbs = {
	n5: sortVerbs(n5Verbs),
	n4: sortVerbs(n4Verbs),
	n3: sortVerbs(n3Verbs),
	n2: sortVerbs(n2Verbs),
	n1: sortVerbs(n1Verbs)
};
