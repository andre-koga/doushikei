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
</script>

<div class="mb-6 text-center">
	<p class="text-lg">
		Conjugate this verb to the
		<span class="font-semibold">{currentTenseOption?.label}</span>
		<span class="text-sm text-gray-400">({currentTenseOption?.description})</span> tense
		{#if hasPolarity}
			in the <span class="font-semibold">{currentPolarityOption?.label}</span>
		{/if}
		{#if hasFormality}
			{#if hasPolarity},{/if}
			<span class="font-semibold">{currentFormalityOption?.label}</span> form
		{/if}.
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
