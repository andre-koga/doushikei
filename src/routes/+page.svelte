<script lang="ts">
	import { onMount } from 'svelte';
	import '../styles.css';

	// Components
	import VerbCard from '$lib/components/VerbCard.svelte';
	import InstructionsDisplay from '$lib/components/InstructionsDisplay.svelte';
	import AnswerInput from '$lib/components/AnswerInput.svelte';
	import FeedbackDisplay from '$lib/components/FeedbackDisplay.svelte';
	import TenseExplanation from '$lib/components/TenseExplanation.svelte';
	import NextButton from '$lib/components/NextButton.svelte';
	import ScoreDisplay from '$lib/components/ScoreDisplay.svelte';
	import TensePerformance from '$lib/components/TensePerformance.svelte';
	import TenseSelector from '$lib/components/TenseSelector.svelte';
	import PolaritySelector from '$lib/components/PolaritySelector.svelte';
	import FormalitySelector from '$lib/components/FormalitySelector.svelte';

	// Stores and utilities
	import { loadPreferences } from '$lib/stores/preferenceStore';
	import { newQuestion } from '$lib/stores/gameStore';
	import { currentVerb, isCorrect, showAnswer } from '$lib/stores/gameStore';
	import { conjugator } from '$lib/conjugation';
	import type { JapaneseVerb, ConjugationForm } from '$lib/types';

	// Global keyboard event handler
	function handleGlobalKeyDown(event: KeyboardEvent) {
		// If Enter key is pressed and we're at the "Next Verb" stage
		if (event.key === 'Enter' && ($isCorrect || $showAnswer)) {
			newQuestion();
			event.preventDefault(); // Prevent default behavior
		}
	}

	// Initialize on component mount
	onMount(() => {
		// Apply dark mode by default
		document.documentElement.classList.add('dark');

		// Load user preferences
		loadPreferences();

		// Start with a new question
		newQuestion();

		// Add global keyboard event listener
		document.addEventListener('keydown', handleGlobalKeyDown);

		// Cleanup function to remove event listener when component unmounts
		return () => {
			document.removeEventListener('keydown', handleGlobalKeyDown);
		};
	});

	let selectedVerb: JapaneseVerb | undefined;
	let conjugationForm: ConjugationForm = 'present';

	$: conjugatedForm = selectedVerb ? conjugator.conjugate(selectedVerb, conjugationForm) : '';

	const allVerbs = conjugator.getAllVerbs();
</script>

<p class="bg-red-600/40 px-2 py-1.5 text-center text-sm">This app is still under development!</p>

<main class="container mx-auto max-w-4xl bg-gray-900 px-4 py-8 text-white">
	<h1 class="mb-6 text-center text-3xl font-bold">日本語動詞活用練習</h1>
	<h2 class="mb-8 text-center text-xl font-semibold">Japanese Verb Conjugation Practice</h2>

	<div class="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg">
		<div class="mb-6 grid gap-8 md:grid-cols-2">
			<!-- Tense Selection -->
			<TenseSelector />

			<!-- Polarity Selection -->
			<PolaritySelector />

			<!-- Formality Selection -->
			<FormalitySelector />
		</div>

		{#if $currentVerb}
			<!-- Verb information -->
			<VerbCard />

			<!-- Instructions -->
			<InstructionsDisplay />

			<!-- User answer input -->
			<AnswerInput />

			<!-- Feedback and answer -->
			<FeedbackDisplay />

			<!-- Next question button -->
			<NextButton />

			<!-- Tense explanation -->
			<TenseExplanation />
		{/if}
	</div>

	<!-- Score display -->
	<ScoreDisplay />

	<!-- Tense Performance Stats -->
	<TensePerformance />

	<!-- Example of using the verb conjugator -->
	<!-- <div class="container mx-auto p-4">
		<h1 class="mb-4 text-2xl font-bold">Japanese Verb Conjugator</h1>

		<div class="mb-4">
			<label for="verb-select" class="mb-2 block">Select a verb:</label>
			<select id="verb-select" class="rounded border p-2" bind:value={selectedVerb}>
				<option value={undefined}>Choose a verb...</option>
				{#each allVerbs as verb}
					<option value={verb}>{verb.dictionary} ({verb.meaning})</option>
				{/each}
			</select>
		</div>

		{#if selectedVerb}
			<div class="mb-4">
				<label for="form-select" class="mb-2 block">Select conjugation form:</label>
				<select id="form-select" class="rounded border p-2" bind:value={conjugationForm}>
					<option value="present">Present</option>
					<option value="past">Past</option>
					<option value="negative">Negative</option>
					<option value="te">Te-form</option>
					<option value="potential">Potential</option>
					<option value="passive">Passive</option>
					<option value="causative">Causative</option>
					<option value="imperative">Imperative</option>
				</select>
			</div>

			<div class="mt-6 rounded bg-gray-100 p-4">
				<h2 class="mb-2 text-xl">Conjugation Result:</h2>
				<div class="text-2xl font-bold">{conjugatedForm}</div>
				<div class="mt-2 text-gray-600">
					Original: {selectedVerb.dictionary} ({selectedVerb.kana})
					<br />
					Meaning: {selectedVerb.meaning}
				</div>
			</div>
		{/if}
	</div> -->
</main>

<footer class="flex flex-col items-center gap-1 bg-gray-900 pt-4 pb-20 text-center text-gray-400">
	<p class="font-bold text-gray-300">日本語動詞活用練習</p>
	<p class="text-sm">
		Created with 🥰 by <a
			href="https://github.com/andre-koga"
			target="_blank"
			class="text-indigo-400 hover:text-indigo-300">Andre Koga</a
		> @ 2025
	</p>
	<p class="text-sm text-gray-400">
		Donate to support the development of this app and other projects!
	</p>
</footer>

<style>
	.container {
		max-width: 800px;
	}
</style>
