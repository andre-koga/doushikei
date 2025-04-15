<script lang="ts">
	import { currentVerb } from '$lib/stores/gameStore';
	import type { JapaneseVerb } from '$lib/types';
	import { ExternalLink } from 'lucide-svelte';

	$: verb = $currentVerb as JapaneseVerb;
</script>

<div class="mb-6 rounded-lg bg-gray-700 p-4 text-center">
	{#if verb}
		<div class="mb-2 flex items-center justify-center gap-2 text-xl font-bold">
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
		</div>
		<div class="mb-1 text-lg text-gray-300">{verb.kana}</div>
		<div class="text-gray-400">{verb.meaning}</div>
		<div class="mt-2 text-sm text-gray-500">Type: {verb.type}</div>
		{#if verb.transitivity}
			<div class="mt-1 text-sm text-gray-500">Transitivity: {verb.transitivity}</div>
		{/if}
	{/if}
</div>
