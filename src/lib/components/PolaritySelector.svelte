<script lang="ts">
	import { polarityOptions, tenseOptions } from '$lib/verbs';
	import { enabledPolarities } from '$lib/stores/preferenceStore';
	import { togglePolarity, toggleAllPolarities } from '$lib/stores/preferenceStore';
	import { currentTense } from '$lib/stores/gameStore';

	// Determine if polarity selection should be disabled based on current tense
	$: currentTenseOption = tenseOptions.find((t) => t.id === $currentTense);
	$: isPolarityDisabled = currentTenseOption ? !currentTenseOption.hasPolarity : false;
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		<h3 class="font-medium">Polarity</h3>
		<div class="flex gap-2">
			<button
				class="rounded bg-indigo-900 px-2 py-1 text-xs text-white hover:bg-indigo-800 {isPolarityDisabled
					? 'cursor-not-allowed opacity-50'
					: ''}"
				on:click={() => !isPolarityDisabled && toggleAllPolarities(true)}
				disabled={isPolarityDisabled}
			>
				Select All
			</button>
			<button
				class="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200 hover:bg-gray-600 {isPolarityDisabled
					? 'cursor-not-allowed opacity-50'
					: ''}"
				on:click={() => !isPolarityDisabled && toggleAllPolarities(false)}
				disabled={isPolarityDisabled}
			>
				Clear
			</button>
		</div>
	</div>
	<div class="flex flex-wrap gap-2">
		{#each polarityOptions as option}
			<button
				class="rounded-md px-3 py-1 text-sm transition-colors
				{$enabledPolarities.includes(option.id)
					? 'bg-indigo-600 text-white hover:bg-indigo-700'
					: 'bg-gray-700 text-white hover:bg-gray-600'}
				{isPolarityDisabled ? 'cursor-not-allowed opacity-50' : ''}"
				on:click={() => !isPolarityDisabled && togglePolarity(option.id)}
				disabled={isPolarityDisabled}
			>
				{option.label}
			</button>
		{/each}
	</div>
	<div class="mt-1 text-xs text-gray-400">
		{#if isPolarityDisabled}
			<span class="text-amber-400"
				>Polarity options not applicable for {currentTenseOption?.label} tense</span
			>
		{:else}
			{$enabledPolarities.length} of {polarityOptions.length} selected
		{/if}
	</div>
</div>
