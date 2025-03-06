<script lang="ts">
	import { polarityOptions } from '$lib/verbs';
	import { enabledPolarities } from '$lib/stores/preferenceStore';
	import { togglePolarity, toggleAllPolarities } from '$lib/stores/preferenceStore';
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		<h3 class="font-medium">Polarity</h3>
		<div class="flex gap-2">
			<button
				class="rounded bg-indigo-900 px-2 py-1 text-xs text-white hover:bg-indigo-800"
				on:click={() => toggleAllPolarities(true)}
			>
				Select All
			</button>
			<button
				class="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200 hover:bg-gray-600"
				on:click={() => toggleAllPolarities(false)}
			>
				Clear
			</button>
		</div>
	</div>
	<div class="flex flex-wrap gap-2">
		{#each polarityOptions as option}
			<button
				class="rounded-md px-3 py-1 text-sm transition-colors {$enabledPolarities.includes(
					option.id
				)
					? 'bg-indigo-600 text-white hover:bg-indigo-700'
					: 'bg-gray-700 text-white hover:bg-gray-600'}"
				on:click={() => togglePolarity(option.id)}
			>
				{option.label}
			</button>
		{/each}
	</div>
	<div class="mt-1 text-xs text-gray-400">
		{$enabledPolarities.length} of {polarityOptions.length} selected
	</div>
</div>
