<script lang="ts">
	import { score } from '$lib/stores/gameStore';
	import { newQuestion, resetGame } from '$lib/stores/gameStore';
</script>

<div class="mb-4 rounded-lg bg-gray-800 p-3 shadow-lg">
	<div class="flex items-center justify-between">
		<p class="text-lg">
			Score: {$score.correct}/{$score.total}
			({$score.total > 0 ? Math.round(($score.correct / $score.total) * 100) : 0}%)
		</p>

		<div class="flex gap-2">
			<button
				class="rounded-md bg-green-600 px-3 py-1 font-semibold text-white transition-colors hover:bg-green-700"
				on:click={newQuestion}
			>
				New Question
			</button>

			<button
				on:click={resetGame}
				class="rounded-md bg-gray-600 px-3 py-1 font-semibold text-white transition hover:bg-gray-700 focus:ring focus:ring-gray-500 focus:outline-none"
			>
				Reset
			</button>
		</div>
	</div>
</div>
