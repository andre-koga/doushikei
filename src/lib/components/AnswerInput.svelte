<script lang="ts">
	import {
		currentVerb,
		currentTense,
		currentPolarity,
		currentFormality,
		isCorrect,
		showAnswer,
		remainingAttempts
	} from '$lib/stores/gameStore';
	import { tenseOptions } from '$lib/verbs';
	import { conjugator, checkAnswer as checkConjugationAnswer } from '$lib/conjugation';
	import { romajiToJapanese, isRomaji } from '$lib/romaji';
	import type { JapaneseVerb, Tense } from '$lib/types';

	let userInput = '';
	let expectedAnswer = '';
	let kanjiAnswer = '';
	let feedback = '';
	let previewText = '';
	let lastProcessedInput = '';

	// Update preview text when user types
	$: if (userInput && isRomaji(userInput)) {
		previewText = romajiToJapanese(userInput);
	} else {
		previewText = '';
	}

	$: if ($currentVerb) {
		const verb = $currentVerb as JapaneseVerb;
		expectedAnswer = conjugator.conjugate(
			verb,
			$currentTense as Tense,
			$currentPolarity,
			$currentFormality
		);

		// Also get the kanji version by creating a copy of the verb with dictionary as dictionary
		const kanjiVerb = {
			...verb,
			kana: verb.dictionary // This makes the original conjugator use the kanji form
		};
		kanjiAnswer = conjugator.conjugate(
			kanjiVerb,
			$currentTense as Tense,
			$currentPolarity,
			$currentFormality
		);

		lastProcessedInput = '';
	}

	// Get the readable tense name
	$: tenseLabel = tenseOptions.find((t) => t.id === $currentTense)?.label || $currentTense;

	// Reset attempts when a new verb is loaded
	$: if ($currentVerb) {
		remainingAttempts.set(3);
		feedback = '';
	}

	function handleSubmit() {
		if (!$currentVerb) return;

		lastProcessedInput = userInput;
		// Convert romaji input to Japanese if needed
		const processedInput = isRomaji(userInput) ? romajiToJapanese(userInput) : userInput;
		const isAnswerCorrect = checkConjugationAnswer(expectedAnswer, processedInput);

		if (isAnswerCorrect) {
			isCorrect.set(true);
			feedback = 'Correct! 🎉';
			userInput = ''; // Clear input when correct
		} else {
			remainingAttempts.update((n) => n - 1);
			if ($remainingAttempts > 0) {
				feedback = `Incorrect. You have ${$remainingAttempts} ${$remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining.`;
				userInput = ''; // Clear incorrect input
			} else {
				feedback = 'No more attempts remaining.';
				showAnswer.set(true);
			}
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="mb-4">
	<div class="flex flex-col space-y-4">
		<div class="mb-4 text-center">
			{#if $remainingAttempts < 3 && !$isCorrect && !$showAnswer}
				<p class="mt-2 text-yellow-500">
					{feedback}
				</p>
				<!-- <p class="mt-2 text-sm text-gray-400">
					Debug - Last input: {lastProcessedInput}
					{#if isRomaji(lastProcessedInput)}
						→ Converted to: {romajiToJapanese(lastProcessedInput)}
					{/if}
					<br />
					Expected: {expectedAnswer}
				</p> -->
			{/if}
		</div>
		<div class="relative">
			<input
				type="text"
				bind:value={userInput}
				placeholder="Enter conjugated form..."
				class="w-full rounded-lg bg-gray-600 p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
				disabled={$isCorrect || $showAnswer}
			/>
			{#if previewText}
				<div class="py-2 text-sm text-indigo-400">
					Preview: {previewText}
				</div>
			{/if}
		</div>
		<button
			type="submit"
			class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
			disabled={$isCorrect || $showAnswer || !userInput.trim()}
		>
			Check Answer
		</button>
	</div>
</form>

{#if $showAnswer || $isCorrect}
	<div class="mt-4 text-center">
		{#if $isCorrect}
			<p class="mb-2 text-green-500">{feedback}</p>
		{:else}
			<p class="mb-2 text-red-500">{feedback}</p>
		{/if}
		<p class="text-lg">Answer: <span class="font-bold">{kanjiAnswer} ({expectedAnswer})</span></p>
	</div>
{/if}
