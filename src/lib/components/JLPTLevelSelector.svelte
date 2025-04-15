<script lang="ts">
	import { enabledJLPTLevels, savePreferences } from '$lib/stores/preferenceStore';

	const jlptLevels = [
		{ id: 'n5', label: 'N5', description: 'Basic Level' },
		{ id: 'n4', label: 'N4', description: 'Elementary Level' },
		{ id: 'n3', label: 'N3', description: 'Intermediate Level' },
		{ id: 'n2', label: 'N2', description: 'Pre-Advanced Level' },
		{ id: 'n1', label: 'N1', description: 'Advanced Level' }
	];

	function toggleLevel(level: string) {
		enabledJLPTLevels.update((levels) => {
			if (levels.includes(level)) {
				// Don't allow deselecting all levels
				if (levels.length > 1) {
					return levels.filter((l) => l !== level);
				}
				return levels;
			} else {
				return [...levels, level];
			}
		});
		savePreferences();
	}

	function toggleAllLevels(select: boolean) {
		if (select) {
			enabledJLPTLevels.set(jlptLevels.map((l) => l.id));
		} else {
			// Keep at least one level selected
			enabledJLPTLevels.set([jlptLevels[0].id]);
		}
		savePreferences();
	}
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		<h3 class="font-medium">JLPT Level</h3>
		<div class="flex gap-2">
			<button
				class="rounded bg-indigo-900 px-2 py-1 text-xs text-white hover:bg-indigo-800"
				on:click={() => toggleAllLevels(true)}
			>
				Select All
			</button>
			<button
				class="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200 hover:bg-gray-600"
				on:click={() => toggleAllLevels(false)}
			>
				Clear
			</button>
		</div>
	</div>
	<div class="flex flex-wrap gap-2">
		{#each jlptLevels as level}
			<button
				class="tooltip rounded-md px-3 py-1 text-sm transition-colors {$enabledJLPTLevels.includes(
					level.id
				)
					? 'bg-indigo-600 text-white hover:bg-indigo-700'
					: 'bg-gray-700 text-white hover:bg-gray-600'}"
				on:click={() => toggleLevel(level.id)}
			>
				{level.label}
				<span class="text-xs text-gray-400">{level.description}</span>
			</button>
		{/each}
	</div>
	<div class="mt-1 text-xs text-gray-400">
		{$enabledJLPTLevels.length} of {jlptLevels.length} selected
	</div>
</div>
