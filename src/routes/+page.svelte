<script lang="ts">
	import { onMount } from 'svelte';
	import { verbs, tenseOptions, polarityOptions, formalityOptions, type Verb } from '$lib/verbs';
	import { conjugateVerb, checkAnswer } from '$lib/conjugation';

	// State variables
	let selectedTense = tenseOptions[0].id;
	let selectedPolarity = polarityOptions[0].id;
	let selectedFormality = formalityOptions[0].id;
	let currentVerb: Verb | null = null;
	let userAnswer = '';
	let feedback = '';
	let isCorrect = false;
	let showAnswer = false;
	let score = 0;
	let attempts = 0;
	let correctAnswer = '';

	// Get a random verb from our list
	function getRandomVerb(): Verb {
		const randomIndex = Math.floor(Math.random() * verbs.length);
		return verbs[randomIndex];
	}

	// Start a new question
	function newQuestion() {
		currentVerb = getRandomVerb();
		userAnswer = '';
		feedback = '';
		isCorrect = false;
		showAnswer = false;

		// Compute the correct answer in advance
		if (currentVerb) {
			correctAnswer = conjugateVerb(
				currentVerb,
				selectedTense,
				selectedPolarity,
				selectedFormality
			);
		}
	}

	// Check the user's answer
	function checkUserAnswer() {
		if (!currentVerb || !userAnswer.trim()) return;

		attempts++;

		if (checkAnswer(correctAnswer, userAnswer)) {
			feedback = '正解！ (Correct!)';
			isCorrect = true;
			score++;
		} else {
			feedback = '不正解 (Incorrect)';
			isCorrect = false;
		}
	}

	// Show the correct answer
	function revealAnswer() {
		showAnswer = true;
	}

	// Reset the game
	function resetGame() {
		score = 0;
		attempts = 0;
		newQuestion();
	}

	// Watch for changes in the selected options and generate a new question
	$: {
		if (selectedTense && selectedPolarity && selectedFormality) {
			newQuestion();
		}
	}

	// Initialize on component mount
	onMount(() => {
		newQuestion();
	});
</script>

<main class="container mx-auto max-w-4xl px-4 py-8">
	<h1 class="mb-6 text-center text-3xl font-bold">日本語動詞活用練習</h1>
	<h2 class="mb-8 text-center text-xl font-semibold">Japanese Verb Conjugation Practice</h2>

	<div class="mb-8 rounded-lg bg-white p-6 shadow-lg">
		<div class="mb-6 grid gap-4 md:grid-cols-3">
			<!-- Tense Selection -->
			<div class="space-y-2">
				<label for="tense" class="block font-medium">Tense/Form</label>
				<select
					id="tense"
					bind:value={selectedTense}
					class="w-full rounded-md border p-2 focus:ring focus:ring-indigo-200"
				>
					{#each tenseOptions as option}
						<option value={option.id}>{option.label} ({option.description})</option>
					{/each}
				</select>
			</div>

			<!-- Polarity Selection -->
			<div class="space-y-2">
				<label for="polarity" class="block font-medium">Polarity</label>
				<select
					id="polarity"
					bind:value={selectedPolarity}
					class="w-full rounded-md border p-2 focus:ring focus:ring-indigo-200"
				>
					{#each polarityOptions as option}
						<option value={option.id}>{option.label} ({option.description})</option>
					{/each}
				</select>
			</div>

			<!-- Formality Selection -->
			<div class="space-y-2">
				<label for="formality" class="block font-medium">Formality</label>
				<select
					id="formality"
					bind:value={selectedFormality}
					class="w-full rounded-md border p-2 focus:ring focus:ring-indigo-200"
				>
					{#each formalityOptions as option}
						<option value={option.id}>{option.label} ({option.description})</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Verb information -->
		{#if currentVerb}
			<div class="mb-6 rounded-lg bg-gray-50 p-4">
				<div class="flex flex-col items-center space-y-3">
					<p class="text-xl font-bold">{currentVerb.dictionary}</p>
					<p class="text-md text-gray-600">{currentVerb.kana}</p>
					<p class="text-md italic">"{currentVerb.meaning}"</p>
					<p class="text-sm text-gray-500">
						Type: {currentVerb.type.charAt(0).toUpperCase() + currentVerb.type.slice(1)}
						{#if currentVerb.ending}
							({currentVerb.ending}-row verb)
						{/if}
					</p>
				</div>
			</div>

			<!-- Instructions -->
			<div class="mb-6 text-center">
				<p class="text-lg">
					Conjugate this verb to the
					<span class="font-semibold"
						>{tenseOptions.find((t) => t.id === selectedTense)?.label}</span
					>
					tense in the
					<span class="font-semibold"
						>{polarityOptions.find((p) => p.id === selectedPolarity)?.label}</span
					>,
					<span class="font-semibold"
						>{formalityOptions.find((f) => f.id === selectedFormality)?.label}</span
					> form.
				</p>
			</div>

			<!-- User answer input -->
			<div class="mb-6">
				<div class="flex">
					<input
						type="text"
						bind:value={userAnswer}
						placeholder="Enter your answer..."
						class="flex-grow rounded-l-md border p-3 focus:ring focus:ring-indigo-200 focus:outline-none"
						disabled={isCorrect || showAnswer}
					/>
					<button
						on:click={checkUserAnswer}
						class="rounded-r-md bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:ring focus:ring-indigo-200 focus:outline-none"
						disabled={isCorrect || showAnswer}
					>
						Check
					</button>
				</div>
			</div>

			<!-- Feedback and answer -->
			{#if feedback}
				<div class="mb-6 text-center">
					<p class="text-lg font-semibold {isCorrect ? 'text-green-600' : 'text-red-600'}">
						{feedback}
					</p>

					{#if !isCorrect && !showAnswer}
						<button
							on:click={revealAnswer}
							class="mt-3 text-indigo-600 underline hover:text-indigo-800"
						>
							Show Answer
						</button>
					{/if}

					{#if showAnswer && !isCorrect}
						<p class="mt-3">
							The correct answer is: <span class="font-semibold">{correctAnswer}</span>
						</p>
					{/if}
				</div>
			{/if}

			<!-- Next question button -->
			{#if isCorrect || showAnswer}
				<div class="text-center">
					<button
						on:click={newQuestion}
						class="rounded-md bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 focus:ring focus:ring-green-200 focus:outline-none"
					>
						Next Verb
					</button>
				</div>
			{/if}
		{/if}
	</div>

	<!-- Score display -->
	<div class="rounded-lg bg-white p-6 shadow-lg">
		<div class="text-center">
			<h3 class="mb-3 text-xl font-semibold">Score</h3>
			<p class="text-2xl">
				{score} / {attempts}
				({attempts > 0 ? Math.round((score / attempts) * 100) : 0}%)
			</p>

			<button
				on:click={resetGame}
				class="mt-4 rounded-md bg-gray-600 px-4 py-2 font-semibold text-white transition hover:bg-gray-700 focus:ring focus:ring-gray-200 focus:outline-none"
			>
				Reset
			</button>
		</div>
	</div>
</main>

<footer class="p-6 text-center text-gray-600">
	<p>Japanese Verb Conjugation Practice App</p>
	<p class="text-sm">Created with Svelte and Tailwind CSS</p>
</footer>
