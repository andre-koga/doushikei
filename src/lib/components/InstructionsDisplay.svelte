<script lang="ts">
	import {
		currentTense,
		currentPolarity,
		currentFormality,
		remainingAttempts
	} from '$lib/stores/gameStore';
	import { tenseOptions, polarityOptions, formalityOptions } from '$lib/verbs';

	$: currentTenseOption = tenseOptions.find((t) => t.id === $currentTense);
	$: currentPolarityOption = polarityOptions.find((p) => p.id === $currentPolarity);
	$: currentFormalityOption = formalityOptions.find((f) => f.id === $currentFormality);

	// Check if the current tense has formality and polarity
	$: hasFormality = currentTenseOption ? currentTenseOption.hasFormality : true;
	$: hasPolarity = currentTenseOption ? currentTenseOption.hasPolarity : true;

	// Generate the instruction string
	$: instructionText = generateInstructionText(
		currentTenseOption,
		currentPolarityOption,
		currentFormalityOption,
		hasPolarity,
		hasFormality
	);

	function generateInstructionText(
		tenseOption: any,
		polarityOption: any,
		formalityOption: any,
		showPolarity: boolean,
		showFormality: boolean
	): string {
		if (!tenseOption) return 'Conjugate this verb';

		let text = `Conjugate this verb to the ${tenseOption.label} tense`;

		// Add description in parentheses
		const description = tenseOption.description ? ` (${tenseOption.description})` : '';
		text = `Conjugate this verb to the <span class="font-semibold">${tenseOption.label}</span><span class="text-sm text-gray-400">${description}</span> tense`;

		// Add polarity if applicable
		if (showPolarity && polarityOption) {
			text += ` in the <span class="font-semibold">${polarityOption.label}</span>`;
		}

		// Add formality if applicable
		if (showFormality && formalityOption) {
			if (showPolarity) {
				text += ',';
			}
			text += ` <span class="font-semibold">${formalityOption.label}</span>`;
		}

		return text + ' form.';
	}
</script>

<div class="mb-6 text-center">
	<p class="text-lg">
		{@html instructionText}
	</p>
	{#if $currentTense === 'must' && $currentPolarity === 'affirmative'}
		<p class="mt-2 text-sm text-indigo-400">
			Note: Both なければならない and なければなりません forms are accepted for this tense.
		</p>
	{/if}
	<p class="mt-2 text-sm text-gray-400">
		You have {$remainingAttempts}
		{$remainingAttempts === 1 ? 'attempt' : 'attempts'} for this question.
	</p>
</div>
