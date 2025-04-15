// Combine all rules into a single object
import { basicRules } from './basic';
import { shouldRules } from './should';
import { mustRules } from './must';
import { attemptiveRules } from './attemptive';
import { preparatoryRules } from './preparatory';
import { regrettableRules } from './regrettable';
import { givingRules } from './giving';
import { receivingRules } from './receiving';
import { simultaneousRules } from './simultaneous';
import { purposeGoingRules } from './purposeGoing';
import { purposeComingRules } from './purposeComing';

export const allRules = {
	...basicRules,
	...shouldRules,
	...mustRules,
	...attemptiveRules,
	...preparatoryRules,
	...regrettableRules,
	...givingRules,
	...receivingRules,
	...simultaneousRules,
	...purposeGoingRules,
	...purposeComingRules
};
