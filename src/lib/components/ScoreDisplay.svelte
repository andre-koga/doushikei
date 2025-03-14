<script lang="ts">
	import { score } from '$lib/stores/gameStore';
	import { newQuestion, resetGame } from '$lib/stores/gameStore';
</script>

<div class="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg">
	<div class="text-center">
		<h3 class="mb-3 text-xl font-semibold">Score</h3>
		<p class="text-2xl">
			{$score.correct} / {$score.total}
			(
			{$score.total > 0 ? Math.round(($score.correct / $score.total) * 100) : 0}% )
		</p>

		<div class="mt-4 flex justify-center gap-4">
			<button
				class="rounded-md bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
				on:click={newQuestion}
			>
				New Question
			</button>

			<button
				on:click={resetGame}
				class="rounded-md bg-gray-600 px-4 py-2 font-semibold text-white transition hover:bg-gray-700 focus:ring focus:ring-gray-500 focus:outline-none"
			>
				Reset
			</button>
		</div>
	</div>
</div>
