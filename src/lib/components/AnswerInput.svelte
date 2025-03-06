<script lang="ts">
	import { onMount } from 'svelte';
	import { isRomaji } from '$lib/romaji';
	import {
		userAnswer,
		convertedAnswer,
		isCorrect,
		showAnswer,
		remainingAttempts
	} from '$lib/stores/gameStore';
	import { useRomaji } from '$lib/stores/preferenceStore';
	import { checkUserAnswer, processInput } from '$lib/utils/gameUtils';

	let answerInput: HTMLInputElement | null = null;

	// Focus the input field
	function focusInput() {
		if (answerInput && !$isCorrect && !$showAnswer) {
			setTimeout(() => {
				answerInput?.focus();
			}, 50);
		}
	}

	// Handle key press in the input field
	function handleKeyDown(event: KeyboardEvent) {
		// If Enter key is pressed while answering
		if (event.key === 'Enter' && !$isCorrect && !$showAnswer && $remainingAttempts > 0) {
			checkUserAnswer($useRomaji);
			event.preventDefault();
			event.stopPropagation(); // Stop the event from bubbling up to the document level
		}
	}

	// Update converted answer when user types
	$: if ($userAnswer && $useRomaji && isRomaji($userAnswer)) {
		$convertedAnswer = processInput($userAnswer, true);
	} else if ($userAnswer) {
		$convertedAnswer = $userAnswer;
	} else {
		$convertedAnswer = '';
	}

	// Focus input field when component mounts
	onMount(() => {
		focusInput();
	});
</script>

<div class="mb-6">
	<div class="flex flex-col">
		<div class="flex">
			<input
				type="text"
				bind:value={$userAnswer}
				bind:this={answerInput}
				on:keydown={handleKeyDown}
				placeholder={$useRomaji
					? 'Enter your answer in romaji... (press Enter to submit)'
					: 'Enter your answer in Japanese... (press Enter to submit)'}
				class="flex-grow rounded-l-md border border-gray-600 bg-gray-700 p-3 text-white focus:ring focus:ring-indigo-500 focus:outline-none"
				disabled={$isCorrect || $showAnswer}
				autocomplete="off"
			/>
			<button
				on:click={() => checkUserAnswer($useRomaji)}
				class="rounded-r-md bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:ring focus:ring-indigo-400 focus:outline-none"
				disabled={$isCorrect || $showAnswer}
			>
				Check
			</button>
		</div>

		<!-- Romaji conversion preview -->
		{#if $useRomaji && $convertedAnswer && !$isCorrect && !$showAnswer && $remainingAttempts > 0}
			<div class="mt-2 text-gray-300">
				<span class="text-sm">Will be converted to:</span>
				<span class="ml-2 font-medium">{$convertedAnswer}</span>
			</div>
		{/if}
	</div>
</div>
