<script lang="ts">
	import { formalityOptions, tenseOptions } from '$lib/verbs';
	import { enabledFormalities } from '$lib/stores/preferenceStore';
	import { toggleFormality, toggleAllFormalities } from '$lib/stores/preferenceStore';
	import { currentTense } from '$lib/stores/gameStore';

	// Determine if formality selection should be disabled based on current tense
	$: currentTenseOption = tenseOptions.find((t) => t.id === $currentTense);
	$: isFormalityDisabled = currentTenseOption ? !currentTenseOption.hasFormality : false;
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		<h3 class="font-medium">Formality</h3>
		<div class="flex gap-2">
			<button
				class="rounded bg-indigo-900 px-2 py-1 text-xs text-white hover:bg-indigo-800"
				on:click={() => toggleAllFormalities(true)}
			>
				Select All
			</button>
			<button
				class="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200 hover:bg-gray-600"
				on:click={() => toggleAllFormalities(false)}
			>
				Clear
			</button>
		</div>
	</div>
	<div class="flex flex-wrap gap-2">
		{#each formalityOptions as option}
			<button
				class="rounded-md px-3 py-1 text-sm transition-colors
				{$enabledFormalities.includes(option.id)
					? 'bg-indigo-600 text-white hover:bg-indigo-700'
					: 'bg-gray-700 text-white hover:bg-gray-600'}"
				on:click={() => toggleFormality(option.id)}
			>
				{option.label}
			</button>
		{/each}
	</div>
	<div class="mt-1 text-xs text-gray-400">
		{#if isFormalityDisabled}
			<span class="text-amber-400"
				>Formality options not applicable for {currentTenseOption?.label} tense, but will still be used
				for other tenses</span
			>
		{:else}
			{$enabledFormalities.length} of {formalityOptions.length} selected
		{/if}
	</div>
</div>
