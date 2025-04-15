<script lang="ts">
	import { page } from '$app/state';
	import { allVerbs } from '$lib/jlpt-verbs';
	import type { Verb } from '$lib/verbs';

	// Get the level from the URL parameter using $state
	let level = $state(page.params.level);

	// Create a reactive effect to update level when params change
	$effect(() => {
		level = page.params.level;
	});

	// Get verbs for the current level using $derived
	let levelVerbs = $derived(
		(allVerbs[level as keyof typeof allVerbs] || []).sort((a: Verb, b: Verb) =>
			a.dictionary.localeCompare(b.dictionary)
		)
	);
</script>

<div class="rounded-lg bg-gray-800 p-6 shadow-lg">
	<h1 class="mb-6 text-center text-3xl font-bold text-gray-100">
		JLPT {level.toUpperCase()} Verbs
	</h1>

	{#if levelVerbs.length === 0}
		<p class="text-center text-gray-400">No verbs found for JLPT {level.toUpperCase()}.</p>
	{:else}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each levelVerbs as verb}
				<div class="rounded-lg bg-gray-700 p-4 shadow transition-shadow hover:shadow-lg">
					<div class="flex items-start justify-between">
						<div>
							<h2 class="text-xl font-semibold text-gray-100">{verb.dictionary}</h2>
							<p class="text-gray-400">{verb.kana}</p>
						</div>
						<span class="rounded bg-indigo-900 px-2 py-1 text-sm text-indigo-200">
							{verb.type}
						</span>
					</div>
					<p class="mt-2 text-gray-300">{verb.meaning}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
