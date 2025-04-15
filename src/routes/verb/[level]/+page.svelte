<script lang="ts">
	import { page } from '$app/state';
	import { allVerbs } from '$lib/jlpt-verbs';
	import type { Verb } from '$lib/verbs';
	import { ExternalLink } from 'lucide-svelte';

	// Get the level from the URL parameter using $state
	let level = $state(page.params.level);

	// Create a reactive effect to update level when params change
	$effect(() => {
		level = page.params.level;
	});

	// Filter states
	let typeFilter = $state<'all' | 'godan' | 'ichidan' | 'irregular'>('all');
	let transitivityFilter = $state<'all' | 'transitive' | 'intransitive'>('all');

	// Get verbs for the current level using $derived
	// Note: allVerbs are now pre-sorted in the source, but we'll sort again here for consistency
	let levelVerbs = $derived(
		(allVerbs[level as keyof typeof allVerbs] || [])
			.slice() // Create a copy to avoid mutating the original array
			.sort((a: Verb, b: Verb) => a.dictionary.localeCompare(b.dictionary, 'ja'))
	);

	// Filtered verbs based on the current filters
	let filteredVerbs = $derived(
		levelVerbs.filter((verb) => {
			// Apply type filter
			if (typeFilter !== 'all' && verb.type !== typeFilter) {
				return false;
			}

			// Apply transitivity filter
			if (transitivityFilter !== 'all' && verb.transitivity !== transitivityFilter) {
				return false;
			}

			return true;
		})
	);

	// Function to reset all filters
	function resetFilters() {
		typeFilter = 'all';
		transitivityFilter = 'all';
	}

	// Check if current level is incomplete
	let isIncompleteLevel = $derived(['n4', 'n3', 'n2', 'n1'].includes(level));
</script>

<h1 class="mb-6 text-center text-3xl font-bold">日本語動詞活用練習</h1>
<h2 class="mb-8 text-center text-xl font-semibold">JLPT {level.toUpperCase()} Verbs</h2>

<div class="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg">
	{#if isIncompleteLevel}
		<div class="mb-6 rounded-lg bg-amber-900/50 px-4 py-3 text-amber-200">
			<p class="text-center font-medium">
				Note: The JLPT {level.toUpperCase()} verb list is still incomplete and being expanded.
			</p>
		</div>
	{/if}

	<p class="mb-6 text-center text-sm text-gray-400">
		Currently {levelVerbs.length} verbs on this level are available for practice.
	</p>

	<!-- Filter controls -->

	<div class="mb-6 grid gap-6 md:grid-cols-2">
		<!-- Verb Type Filter -->
		<div class="rounded-lg shadow">
			<h3 class="mb-3 font-medium">Verb Type</h3>
			<div class="flex flex-wrap gap-2">
				<button
					class="rounded-md px-3 py-1 text-sm transition-colors {typeFilter === 'all'
						? 'bg-indigo-800/90 text-white hover:bg-indigo-900/90'
						: 'bg-gray-700 text-white hover:bg-gray-600'}"
					onclick={() => (typeFilter = 'all')}
				>
					All
				</button>
				<button
					class="rounded-md px-3 py-1 text-sm transition-colors {typeFilter === 'godan'
						? 'bg-indigo-800/90 text-white hover:bg-indigo-900/90'
						: 'bg-gray-700 text-white hover:bg-gray-600'}"
					onclick={() => (typeFilter = 'godan')}
				>
					Godan
				</button>
				<button
					class="rounded-md px-3 py-1 text-sm transition-colors {typeFilter === 'ichidan'
						? 'bg-indigo-800/90 text-white hover:bg-indigo-900/90'
						: 'bg-gray-700 text-white hover:bg-gray-600'}"
					onclick={() => (typeFilter = 'ichidan')}
				>
					Ichidan
				</button>
				<button
					class="rounded-md px-3 py-1 text-sm transition-colors {typeFilter === 'irregular'
						? 'bg-indigo-800/90 text-white hover:bg-indigo-900/90'
						: 'bg-gray-700 text-white hover:bg-gray-600'}"
					onclick={() => (typeFilter = 'irregular')}
				>
					Irregular
				</button>
			</div>
		</div>

		<!-- Transitivity Filter -->
		<div class="mb-2 rounded-lg shadow">
			<h3 class="mb-3 font-medium">Transitivity</h3>
			<div class="flex flex-wrap gap-2">
				<button
					class="rounded-md px-3 py-1 text-sm transition-colors {transitivityFilter === 'all'
						? 'bg-purple-800/90 text-white hover:bg-purple-900/90'
						: 'bg-gray-700 text-white hover:bg-gray-600'}"
					onclick={() => (transitivityFilter = 'all')}
				>
					All
				</button>
				<button
					class="rounded-md px-3 py-1 text-sm transition-colors {transitivityFilter === 'transitive'
						? 'bg-purple-800/90 text-white hover:bg-purple-900/90'
						: 'bg-gray-700 text-white hover:bg-gray-600'}"
					onclick={() => (transitivityFilter = 'transitive')}
				>
					Transitive
				</button>
				<button
					class="rounded-md px-3 py-1 text-sm transition-colors {transitivityFilter ===
					'intransitive'
						? 'bg-purple-800/90 text-white hover:bg-purple-900/90'
						: 'bg-gray-700 text-white hover:bg-gray-600'}"
					onclick={() => (transitivityFilter = 'intransitive')}
				>
					Intransitive
				</button>
			</div>
		</div>

		{#if typeFilter !== 'all' || transitivityFilter !== 'all'}
			<div class="flex justify-end md:col-span-2">
				<button
					class="rounded-md bg-gray-700 px-3 py-1 text-sm text-white transition-colors hover:bg-gray-600"
					onclick={resetFilters}
				>
					Reset Filters
				</button>
			</div>
		{/if}
	</div>

	{#if filteredVerbs.length === 0}
		<p class="text-center text-gray-400">No verbs found matching the current filters.</p>
	{:else}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredVerbs as verb}
				<div class="rounded-lg bg-gray-700 p-4 shadow transition-shadow hover:shadow-lg">
					<div class="flex items-start justify-between">
						<div>
							<h2 class="flex items-center gap-2 text-xl font-semibold text-gray-100">
								{verb.dictionary}
								<a
									href="https://jisho.org/search/{verb.dictionary}"
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center justify-center rounded p-1.5 text-indigo-300 hover:bg-gray-600/50 hover:text-indigo-200"
									title="Look up on Jisho.org"
								>
									<ExternalLink class="h-5 w-5" />
								</a>
							</h2>
							<p class="text-gray-400">{verb.kana}</p>
						</div>
						<div class="flex flex-col gap-1">
							<span class="rounded bg-indigo-900 px-2 py-1 text-sm text-indigo-200">
								{verb.type}
							</span>
							{#if verb.transitivity}
								<span class="rounded bg-purple-900 px-2 py-1 text-sm text-purple-200">
									{verb.transitivity}
								</span>
							{/if}
						</div>
					</div>
					<p class="mt-2 text-gray-300">{verb.meaning}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
