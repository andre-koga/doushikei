<script lang="ts">
	import {
		currentVerb,
		currentTense,
		currentPolarity,
		currentFormality,
		isCorrect,
		showAnswer
	} from '$lib/stores/gameStore';
	import { tenseOptions } from '$lib/verbs';
	import { conjugator } from '$lib/conjugation';
	import type { JapaneseVerb } from '$lib/types';
	import type { Tense } from '$lib/verbs';

	let userInput = '';
	let expectedAnswer = '';

	$: if ($currentVerb) {
		const verb = $currentVerb as JapaneseVerb;
		expectedAnswer = conjugator.conjugate(
			verb,
			$currentTense as Tense,
			$currentPolarity,
			$currentFormality
		);
	}

	// Get the readable tense name
	$: tenseLabel = tenseOptions.find((t) => t.id === $currentTense)?.label || $currentTense;

	function handleSubmit() {
		if (!$currentVerb) return;

		const isAnswerCorrect = userInput.trim() === expectedAnswer.trim();
		isCorrect.set(isAnswerCorrect);

		if (!isAnswerCorrect) {
			showAnswer.set(true);
		} else {
			userInput = ''; // Clear input when correct
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="mb-4">
	<div class="flex flex-col space-y-4">
		<input
			type="text"
			bind:value={userInput}
			placeholder="Enter conjugated form..."
			class="w-full rounded-lg bg-gray-600 p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
			disabled={$isCorrect || $showAnswer}
		/>
		<button
			type="submit"
			class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
			disabled={$isCorrect || $showAnswer}
		>
			Check Answer
		</button>
	</div>
</form>

{#if $showAnswer}
	<div class="mt-4 text-center">
		<p class="text-lg">Correct answer: <span class="font-bold">{expectedAnswer}</span></p>
	</div>
{/if}
