<script lang="ts">
	import { currentVerb } from '$lib/stores/gameStore';
	import type { JapaneseVerb } from '$lib/types';

	$: verb = $currentVerb as JapaneseVerb;
</script>

<div class="mb-6 rounded-lg bg-gray-700 p-4 text-center">
	{#if verb}
		<div class="mb-2 text-xl font-bold">{verb.dictionary}</div>
		<div class="mb-1 text-lg text-gray-300">{verb.kana}</div>
		<div class="text-gray-400">{verb.meaning}</div>
		<div class="mt-2 text-sm text-gray-500">Type: {verb.type}</div>
	{/if}
</div>
