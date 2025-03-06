<script lang="ts">
	import { hasKanji, getHiraganaVersion } from '$lib/utils/gameUtils';
	import {
		feedback,
		isCorrect,
		showAnswer,
		correctAnswer,
		convertedAnswer,
		currentTense
	} from '$lib/stores/gameStore';

	$: hiraganaAnswer = getHiraganaVersion($correctAnswer);
</script>

{#if $feedback}
	<div class="mb-6 text-center">
		<p class="text-lg font-semibold {$isCorrect ? 'text-green-400' : 'text-red-400'}">
			{$feedback}
		</p>

		{#if $showAnswer || $isCorrect}
			<div class="mt-3">
				<p>
					{#if $isCorrect}
						You entered: <span class="font-semibold">{$convertedAnswer}</span>
						<br />
						Correct answer: <span class="font-semibold">{$correctAnswer}</span>
					{:else}
						The correct answer is: <span class="font-semibold">{$correctAnswer}</span>
					{/if}
				</p>

				{#if hiraganaAnswer && hasKanji($correctAnswer)}
					<p class="mt-1 text-gray-400">
						(All hiragana: <span class="font-medium">{hiraganaAnswer}</span>)
					</p>
				{/if}

				<p class="mt-2 text-sm text-gray-400">Both kanji and hiragana answers are accepted!</p>
			</div>
		{/if}
	</div>
{/if}
