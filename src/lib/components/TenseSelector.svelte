<script lang="ts">
	import { tenseOptions } from '$lib/verbs';
	import { enabledTenses } from '$lib/stores/preferenceStore';
	import { toggleTense, toggleAllTenses, toggleEssentialTenses } from '$lib/stores/preferenceStore';
</script>

<div class="space-y-2 md:col-span-2">
	<div class="flex items-center justify-between">
		<h3 class="font-medium">Tense/Form</h3>
		<div class="flex gap-2">
			<button
				class="rounded bg-indigo-900 px-2 py-1 text-xs text-white hover:bg-indigo-800"
				on:click={() => toggleAllTenses(true)}
			>
				Select All
			</button>
			<button
				class="rounded bg-indigo-900 px-2 py-1 text-xs text-white hover:bg-indigo-800"
				on:click={() => toggleEssentialTenses(true)}
			>
				Select Essential
			</button>
			<button
				class="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200 hover:bg-gray-600"
				on:click={() => toggleAllTenses(false)}
			>
				Clear
			</button>
		</div>
	</div>
	<div class="flex flex-wrap gap-2">
		{#each tenseOptions as option}
			<button
				class="tooltip rounded-md px-3 py-1 text-sm transition-colors {$enabledTenses.includes(
					option.id
				)
					? 'bg-indigo-600 text-white hover:bg-indigo-700'
					: 'bg-gray-700 text-white hover:bg-gray-600'}
        {option.essential ? 'order-0' : 'order-1'}
        "
				on:click={() => toggleTense(option.id)}
			>
				{option.label}
				<span class="text-xs text-gray-400">{option.description}</span>
				{#if option.longDescription}
					<span class="tooltiptext">{option.longDescription}</span>
				{/if}
			</button>
		{/each}
	</div>
	<div class="mt-1 text-xs text-gray-400">
		{$enabledTenses.length} of {tenseOptions.length} selected
		<span class="ml-2 italic"
			>(Note: Present Affirmative Plain will be skipped when randomizing as it's the dictionary
			form)</span
		>
	</div>
</div>
