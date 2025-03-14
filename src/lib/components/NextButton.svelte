<script lang="ts">
	import { isCorrect, showAnswer, newQuestion } from '$lib/stores/gameStore';
</script>

{#if $isCorrect || $showAnswer}
	<button
		on:click={newQuestion}
		class="mt-6 w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
	>
		Next Verb
	</button>
{/if}
