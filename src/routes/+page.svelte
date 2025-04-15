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
	import JLPTLevelSelector from '$lib/components/JLPTLevelSelector.svelte';

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

<h1 class="mb-6 text-center text-3xl font-bold">日本語動詞活用練習</h1>
<h2 class="mb-8 text-center text-xl font-semibold">Conjugation Practice</h2>

<div class="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg">
	<div class="mb-6 grid gap-8 md:grid-cols-2">
		<!-- Tense Selection -->
		<TenseSelector />

		<!-- JLPT Level Selection -->
		<JLPTLevelSelector />

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

		<!-- Score display -->
		<ScoreDisplay />
	{/if}
</div>

<!-- Tense Performance Stats -->
<TensePerformance />
