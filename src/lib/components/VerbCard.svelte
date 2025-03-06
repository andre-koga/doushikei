<script lang="ts">
	import { currentVerb } from '$lib/stores/gameStore';
</script>

{#if $currentVerb}
	<div class="mb-6 rounded-lg bg-gray-700 p-4">
		<div class="flex flex-col items-center space-y-3">
			<p class="text-xl font-bold">{$currentVerb.dictionary}</p>
			<p class="text-md text-gray-300">{$currentVerb.kana}</p>
			<p class="text-md italic">{$currentVerb.meaning}</p>
			<p class="text-sm text-gray-400">
				Type: {$currentVerb.type.charAt(0).toUpperCase() + $currentVerb.type.slice(1)}
				{#if $currentVerb.ending}
					({$currentVerb.ending}-row verb)
				{/if}
			</p>
		</div>
	</div>
{/if}
