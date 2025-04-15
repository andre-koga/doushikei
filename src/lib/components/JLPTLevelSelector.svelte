<script lang="ts">
	import { enabledJLPTLevels, savePreferences } from '$lib/stores/preferenceStore';
	import { ExternalLink } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	const jlptLevels = [
		{ id: 'n5', label: 'N5' },
		{ id: 'n4', label: 'N4' },
		{ id: 'n3', label: 'N3' },
		{ id: 'n2', label: 'N2' },
		{ id: 'n1', label: 'N1' }
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

	function navigateToLevel(level: string) {
		goto(`/verb/${level}`);
	}
</script>

<div class="space-y-2 md:col-span-2">
	<div class="flex items-center justify-between">
		<h3 class="font-medium">Verb Lists</h3>
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
			<div class="flex items-center divide-x divide-gray-600 overflow-hidden rounded-md">
				<button
					class="px-3 py-1 text-sm transition-colors {$enabledJLPTLevels.includes(level.id)
						? level.id === 'n5'
							? 'bg-violet-800/90 text-white hover:bg-violet-900/90'
							: level.id === 'n4'
								? 'bg-blue-800/90 text-white hover:bg-blue-900/90'
								: level.id === 'n3'
									? 'bg-emerald-800/90 text-white hover:bg-emerald-900/90'
									: level.id === 'n2'
										? 'bg-amber-800/70 text-white hover:bg-amber-900/70'
										: 'bg-red-800/70 text-white hover:bg-red-900/70'
						: 'bg-gray-700 text-white hover:bg-gray-600'}"
					on:click={() => toggleLevel(level.id)}
				>
					{level.label}
				</button>
				<button
					class="flex items-center justify-center bg-gray-700 px-2 py-1.5 text-white hover:bg-gray-600"
					on:click={() => navigateToLevel(level.id)}
					title="View {level.label} verbs"
				>
					<ExternalLink class="h-4 w-4" />
				</button>
			</div>
		{/each}
	</div>
	<div class="mt-1 text-xs text-gray-400">
		{$enabledJLPTLevels.length} of {jlptLevels.length} selected
	</div>
</div>
