<script lang="ts">
	import { tenseOptions } from '$lib/verbs';
	import { tenseStats, totalTenseAttempts, getTenseAccuracy } from '$lib/stores/gameStore';
	import { getAccuracyColorClass } from '$lib/utils/gameUtils';
</script>

<div class="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg">
	<div class="text-center">
		<h3 class="mb-4 text-xl font-semibold">Tense Performance</h3>

		{#if $totalTenseAttempts === 0}
			<p class="text-gray-400">Complete some questions to see your performance by tense.</p>
		{:else}
			<div class="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				{#each tenseOptions as tense}
					{#if $tenseStats[tense.id]?.attempts > 0}
						<div class="rounded-md bg-gray-700 p-3">
							<div class="mb-1 flex items-center justify-between">
								<span class="font-medium">{tense.label}</span>
								<span class="text-sm">
									{$tenseStats[tense.id].correct}/{$tenseStats[tense.id].attempts}
								</span>
							</div>
							<div class="h-2 w-full overflow-hidden rounded-full bg-gray-600">
								<div
									class="{getAccuracyColorClass(getTenseAccuracy(tense.id))} h-full"
									style="width: {getTenseAccuracy(tense.id)}%"
								></div>
							</div>
							<div class="mt-1.5 text-right text-xs text-gray-300">
								{getTenseAccuracy(tense.id)}%
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</div>
