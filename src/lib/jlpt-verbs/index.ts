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

export const allVerbs = {
    n5: n5Verbs,
    n4: n4Verbs,
    n3: n3Verbs,
    n2: n2Verbs,
    n1: n1Verbs
}; 