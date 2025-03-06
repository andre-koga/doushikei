<script lang="ts">
	import { isCorrect, showAnswer } from '$lib/stores/gameStore';
	import { newQuestion } from '$lib/stores/gameStore';
</script>

{#if $isCorrect || $showAnswer}
	<div class="text-center">
		<button
			on:click={newQuestion}
			class="rounded-md bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 focus:ring focus:ring-green-400 focus:outline-none"
		>
			Next Verb
		</button>
		<p class="mt-2 text-sm text-gray-400">(Press Enter to continue)</p>
	</div>
{/if}
