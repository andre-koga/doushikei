<script lang="ts">
	import { onMount } from 'svelte';
	import {
		verbs,
		tenseOptions,
		polarityOptions,
		formalityOptions,
		type Verb,
		type Tense,
		type Polarity,
		type Formality
	} from '$lib/verbs';
	import { conjugateVerb, checkAnswer } from '$lib/conjugation';
	import { romajiToJapanese, isRomaji } from '$lib/romaji';

	// State variables
	let currentVerb: Verb | null = null;
	let userAnswer = '';
	let feedback = '';
	let isCorrect = false;
	let showAnswer = false;
	let score = 0;
	let attempts = 0;
	let correctAnswer = '';
	let useRomaji = true; // Default to using romaji input for better accessibility
	let convertedAnswer = ''; // To show the conversion from romaji to Japanese
	let answerInput: HTMLInputElement | null = null; // Reference to the input element
	let remainingAttempts = 3; // Number of attempts allowed per question
	let currentAttempt = 0; // Current attempt count for the current question

	// Statistics tracking for each tense
	type TenseStats = {
		attempts: number;
		correct: number;
	};

	// Initialize statistics for each tense
	let tenseStats: Record<string, TenseStats> = {};
	tenseOptions.forEach((tense) => {
		tenseStats[tense.id] = { attempts: 0, correct: 0 };
	});

	// Replace single selections with arrays of enabled options
	let enabledTenses = tenseOptions.map((t) => t.id); // Start with all enabled
	let enabledPolarities = polarityOptions.map((p) => p.id); // Start with all enabled
	let enabledFormalities = formalityOptions.map((f) => f.id); // Start with all enabled

	// Currently selected options for the current question
	let currentTense: Tense = 'present';
	let currentPolarity: Polarity = 'affirmative';
	let currentFormality: Formality = 'plain';

	// Global keyboard event handler
	function handleGlobalKeyDown(event: KeyboardEvent) {
		// If Enter key is pressed and we're at the "Next Verb" stage
		if (event.key === 'Enter' && (isCorrect || showAnswer)) {
			newQuestion();
			event.preventDefault(); // Prevent default behavior
		}
	}

	// Function to check if text contains kanji characters
	function hasKanji(text: string): boolean {
		// Check for kanji characters (CJK Unified Ideographs)
		return /[\u4e00-\u9faf]/.test(text);
	}

	// Function to get hiragana version of the answer if it contains kanji
	function getHiraganaVersion(text: string): string | null {
		// This is a simplified function to show the hiragana reading
		// for verbs we know. In a real app, you might use a more comprehensive
		// kanji-to-hiragana conversion or get it from the verb data

		// Map common kanji in our verbs to hiragana
		const kanjiMap: Record<string, string> = {
			行: 'い',
			来: 'く',
			食: 'た',
			飲: 'の',
			見: 'み',
			読: 'よ',
			書: 'か',
			話: 'はな',
			買: 'か'
		};

		if (!hasKanji(text)) return null;

		let result = text;
		Object.entries(kanjiMap).forEach(([kanji, hiragana]) => {
			result = result.replaceAll(kanji, hiragana);
		});

		return result !== text ? result : null;
	}

	// Get a random verb from our list
	function getRandomVerb(): Verb {
		const randomIndex = Math.floor(Math.random() * verbs.length);
		return verbs[randomIndex];
	}

	// Get a random option from an enabled list
	function getRandomOption<T>(options: T[], enabledOptions: T[]): T {
		// If no options are enabled, enable all options
		if (enabledOptions.length === 0) {
			return options[Math.floor(Math.random() * options.length)];
		}

		// Otherwise, select randomly from enabled options
		const randomIndex = Math.floor(Math.random() * enabledOptions.length);
		return enabledOptions[randomIndex];
	}

	// Focus the input field
	function focusInput() {
		if (answerInput && !isCorrect && !showAnswer) {
			setTimeout(() => {
				answerInput?.focus();
			}, 50);
		}
	}

	// Start a new question
	function newQuestion() {
		currentVerb = getRandomVerb();
		userAnswer = '';
		convertedAnswer = '';
		feedback = '';
		isCorrect = false;
		showAnswer = false;
		currentAttempt = 0;
		remainingAttempts = 3;

		// Keep generating new combinations until we get one that isn't the dictionary form
		let isDictionaryForm = true;
		while (isDictionaryForm) {
			// Select random conjugation options from enabled lists
			currentTense = getRandomOption(
				tenseOptions.map((t) => t.id),
				enabledTenses
			);
			currentPolarity = getRandomOption(
				polarityOptions.map((p) => p.id),
				enabledPolarities
			);
			currentFormality = getRandomOption(
				formalityOptions.map((f) => f.id),
				enabledFormalities
			);

			// Skip the dictionary form (present affirmative plain)
			isDictionaryForm =
				currentTense === 'present' &&
				currentPolarity === 'affirmative' &&
				currentFormality === 'plain';

			// If only present-affirmative-plain is enabled, we need to escape this loop
			if (
				isDictionaryForm &&
				enabledTenses.length === 1 &&
				enabledTenses[0] === 'present' &&
				enabledPolarities.length === 1 &&
				enabledPolarities[0] === 'affirmative' &&
				enabledFormalities.length === 1 &&
				enabledFormalities[0] === 'plain'
			) {
				isDictionaryForm = false; // Accept the dictionary form if it's the only option
			}
		}

		// Compute the correct answer in advance
		if (currentVerb) {
			correctAnswer = conjugateVerb(currentVerb, currentTense, currentPolarity, currentFormality);
		}

		// Focus the input field for the new question
		focusInput();
	}

	// Process user input for romaji conversion
	function processInput() {
		if (useRomaji && isRomaji(userAnswer)) {
			convertedAnswer = romajiToJapanese(userAnswer);
		} else {
			convertedAnswer = userAnswer;
		}
	}

	// Check the user's answer and update stats
	function checkUserAnswer() {
		if (!currentVerb || !userAnswer.trim()) return;

		// Increment attempt counters
		attempts++;
		currentAttempt++;

		// Only track stats on first attempt for this question
		if (currentAttempt === 1) {
			// Update tense stats
			tenseStats[currentTense].attempts++;
		}

		// Process input first in case it's romaji
		processInput();

		// Check if the converted answer is correct
		if (checkAnswer(correctAnswer, convertedAnswer)) {
			feedback = '正解！ (Correct!)';
			isCorrect = true;
			score++;

			// Only increment correct stat on first attempt
			if (currentAttempt === 1) {
				tenseStats[currentTense].correct++;
			}
		} else {
			remainingAttempts--;
			if (remainingAttempts > 0) {
				feedback = `不正解 (Incorrect) - ${remainingAttempts} ${remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining`;
				// Clear the input and focus it for next attempt
				userAnswer = '';
				convertedAnswer = '';
				focusInput();
			} else {
				feedback = '不正解 (Incorrect)';
				isCorrect = false;
				// Automatically show the answer after three incorrect attempts
				showAnswer = true;
			}
		}
	}

	// Handle key press in the input field
	function handleKeyDown(event: KeyboardEvent) {
		// If Enter key is pressed while answering
		if (event.key === 'Enter' && !isCorrect && !showAnswer && remainingAttempts > 0) {
			checkUserAnswer();
			event.preventDefault();
			event.stopPropagation(); // Stop the event from bubbling up to the document level
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
		// Reset tense stats
		tenseOptions.forEach((tense) => {
			tenseStats[tense.id] = { attempts: 0, correct: 0 };
		});
		newQuestion();
	}

	// Toggle romaji input mode
	function toggleRomajiMode() {
		// Toggle the flag
		useRomaji = !useRomaji;

		// Clear the input fields
		userAnswer = '';
		convertedAnswer = '';

		// Force a UI update and focus the input
		setTimeout(() => {
			// Ensure the toggle state is properly reflected in the UI
			useRomaji = useRomaji;
			focusInput();
		}, 10);
	}

	// Toggle an option in a list
	function toggleOption<T>(optionId: T, optionsList: T[]): T[] {
		if (optionsList.includes(optionId)) {
			// Remove if already included
			return optionsList.filter((id) => id !== optionId);
		} else {
			// Add if not included
			return [...optionsList, optionId];
		}
	}

	// Toggle functions for each category
	function toggleTense(tenseId: Tense) {
		enabledTenses = toggleOption(tenseId, enabledTenses);
		// Ensure at least one option is selected
		if (enabledTenses.length === 0) {
			enabledTenses = [tenseId];
		}
	}

	function togglePolarity(polarityId: Polarity) {
		enabledPolarities = toggleOption(polarityId, enabledPolarities);
		// Ensure at least one option is selected
		if (enabledPolarities.length === 0) {
			enabledPolarities = [polarityId];
		}
	}

	function toggleFormality(formalityId: Formality) {
		enabledFormalities = toggleOption(formalityId, enabledFormalities);
		// Ensure at least one option is selected
		if (enabledFormalities.length === 0) {
			enabledFormalities = [formalityId];
		}
	}

	// Toggle all options in a category
	function toggleAllTenses(enable: boolean) {
		enabledTenses = enable ? tenseOptions.map((t) => t.id) : [tenseOptions[0].id];
	}
	function toggleEssentialTenses(enable: boolean) {
		const essentialTenses = tenseOptions.filter((t) => t.essential).map((t) => t.id);
		enabledTenses = enable ? essentialTenses : [essentialTenses[0]];
	}

	function toggleAllPolarities(enable: boolean) {
		enabledPolarities = enable ? polarityOptions.map((p) => p.id) : [polarityOptions[0].id];
	}

	function toggleAllFormalities(enable: boolean) {
		enabledFormalities = enable ? formalityOptions.map((f) => f.id) : [formalityOptions[0].id];
	}

	// Calculate accuracy percentage for a tense
	function getTenseAccuracy(tenseId: string): number {
		const stats = tenseStats[tenseId];
		if (stats.attempts === 0) return 0;
		return Math.round((stats.correct / stats.attempts) * 100);
	}

	// Get color class based on accuracy percentage
	function getAccuracyColorClass(accuracy: number): string {
		if (accuracy === 0) return 'bg-gray-700'; // No attempts yet
		if (accuracy >= 90) return 'bg-emerald-800';
		if (accuracy >= 70) return 'bg-green-700';
		if (accuracy >= 50) return 'bg-yellow-700';

		return 'bg-red-800';
	}

	// When user input changes, update the conversion
	$: {
		if (userAnswer && useRomaji && isRomaji(userAnswer)) {
			convertedAnswer = romajiToJapanese(userAnswer);
		} else if (userAnswer) {
			convertedAnswer = userAnswer;
		} else {
			convertedAnswer = '';
		}
	}

	// Initialize on component mount
	onMount(() => {
		// Apply dark mode by default
		document.documentElement.classList.add('dark');

		newQuestion();

		// Add global keyboard event listener
		document.addEventListener('keydown', handleGlobalKeyDown);

		// Cleanup function to remove event listener when component unmounts
		return () => {
			document.removeEventListener('keydown', handleGlobalKeyDown);
		};
	});

	// Get hiragana version of the current correct answer if it contains kanji
	$: hiraganaAnswer = getHiraganaVersion(correctAnswer);

	// Get the current options for display
	$: currentTenseOption = tenseOptions.find((t) => t.id === currentTense);
	$: currentPolarityOption = polarityOptions.find((p) => p.id === currentPolarity);
	$: currentFormalityOption = formalityOptions.find((f) => f.id === currentFormality);

	// Calculate total attempts across all tenses
	$: totalTenseAttempts = Object.values(tenseStats).reduce((sum, stat) => sum + stat.attempts, 0);
</script>

<main class="container mx-auto max-w-4xl bg-gray-900 px-4 py-8 text-white">
	<h1 class="mb-6 text-center text-3xl font-bold">日本語動詞活用練習</h1>
	<h2 class="mb-8 text-center text-xl font-semibold">Japanese Verb Conjugation Practice</h2>

	<div class="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg">
		<div class="mb-6 grid gap-8 md:grid-cols-2">
			<!-- Tense Selection -->
			<div class="space-y-2 md:col-span-2">
				<div class="flex items-center justify-between">
					<h3 class="font-medium">Tense/Form</h3>
					<div class="flex gap-2">
						<button
							class="rounded bg-indigo-900 px-2 py-1 text-xs text-white hover:bg-indigo-800"
							on:click={() => toggleAllTenses(true)}
						>
							Select All
						</button>
						<button
							class="rounded bg-indigo-900 px-2 py-1 text-xs text-white hover:bg-indigo-800"
							on:click={() => toggleEssentialTenses(true)}
						>
							Select Essential
						</button>
						<button
							class="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200 hover:bg-gray-600"
							on:click={() => toggleAllTenses(false)}
						>
							Clear
						</button>
					</div>
				</div>
				<div class="flex flex-wrap gap-2">
					{#each tenseOptions as option}
						<button
							class="rounded-md px-3 py-1 text-sm transition-colors {enabledTenses.includes(
								option.id
							)
								? 'bg-indigo-600 text-white hover:bg-indigo-700'
								: 'bg-gray-700 text-white hover:bg-gray-600'}
							{option.essential ? 'order-0' : 'order-1'}
							"
							on:click={() => toggleTense(option.id)}
						>
							{option.label}
							<span class="text-xs text-gray-400">{option.description}</span>
						</button>
					{/each}
				</div>
				<div class="mt-1 text-xs text-gray-400">
					{enabledTenses.length} of {tenseOptions.length} selected
					<span class="ml-2 italic"
						>(Note: Present Affirmative Plain will be skipped when randomizing as it's the
						dictionary form)</span
					>
				</div>
			</div>

			<!-- Polarity Selection -->
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<h3 class="font-medium">Polarity</h3>
					<div class="flex gap-2">
						<button
							class="rounded bg-indigo-900 px-2 py-1 text-xs text-white hover:bg-indigo-800"
							on:click={() => toggleAllPolarities(true)}
						>
							Select All
						</button>
						<button
							class="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200 hover:bg-gray-600"
							on:click={() => toggleAllPolarities(false)}
						>
							Clear
						</button>
					</div>
				</div>
				<div class="flex flex-wrap gap-2">
					{#each polarityOptions as option}
						<button
							class="rounded-md px-3 py-1 text-sm transition-colors {enabledPolarities.includes(
								option.id
							)
								? 'bg-indigo-600 text-white hover:bg-indigo-700'
								: 'bg-gray-700 text-white hover:bg-gray-600'}"
							on:click={() => togglePolarity(option.id)}
						>
							{option.label}
						</button>
					{/each}
				</div>
				<div class="mt-1 text-xs text-gray-400">
					{enabledPolarities.length} of {polarityOptions.length} selected
				</div>
			</div>

			<!-- Formality Selection -->
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<h3 class="font-medium">Formality</h3>
					<div class="flex gap-2">
						<button
							class="rounded bg-indigo-900 px-2 py-1 text-xs text-white hover:bg-indigo-800"
							on:click={() => toggleAllFormalities(true)}
						>
							Select All
						</button>
						<button
							class="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200 hover:bg-gray-600"
							on:click={() => toggleAllFormalities(false)}
						>
							Clear
						</button>
					</div>
				</div>
				<div class="flex flex-wrap gap-2">
					{#each formalityOptions as option}
						<button
							class="rounded-md px-3 py-1 text-sm transition-colors {enabledFormalities.includes(
								option.id
							)
								? 'bg-indigo-600 text-white hover:bg-indigo-700'
								: 'bg-gray-700 text-white hover:bg-gray-600'}"
							on:click={() => toggleFormality(option.id)}
						>
							{option.label}
						</button>
					{/each}
				</div>
				<div class="mt-1 text-xs text-gray-400">
					{enabledFormalities.length} of {formalityOptions.length} selected
				</div>
			</div>
		</div>

		<!-- Romaji Toggle -->
		<div class="mb-6 flex items-center justify-center">
			<button
				type="button"
				class="flex items-center rounded-md px-2 py-1 transition-colors {useRomaji
					? 'bg-indigo-900 hover:bg-indigo-800'
					: 'bg-gray-700 hover:bg-gray-600'}"
				on:click={toggleRomajiMode}
			>
				<div
					class="relative flex h-4 w-8 items-center rounded-full p-0 transition-colors duration-300 ease-in-out {useRomaji
						? 'bg-indigo-600'
						: 'bg-gray-400'}"
				>
					<!-- Toggle indicator -->
					<div
						class="absolute h-3 w-3 transform rounded-full bg-white shadow transition-transform duration-300 ease-in-out"
						style={useRomaji ? 'transform: translateX(18px)' : 'transform: translateX(2px)'}
					></div>
				</div>
				<span
					class="ml-3 font-medium transition-colors duration-300 {useRomaji
						? 'text-indigo-300'
						: 'text-gray-300'}"
				>
					{useRomaji ? 'Romaji Input: ON' : 'Romaji Input: OFF'}
				</span>
			</button>
		</div>

		<!-- Verb information -->
		{#if currentVerb}
			<div class="mb-6 rounded-lg bg-gray-700 p-4">
				<div class="flex flex-col items-center space-y-3">
					<p class="text-xl font-bold">{currentVerb.dictionary}</p>
					<p class="text-md text-gray-300">{currentVerb.kana}</p>
					<p class="text-md italic">{currentVerb.meaning}</p>
					<p class="text-sm text-gray-400">
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
					<span class="font-semibold">{currentTenseOption?.label}</span>
					tense in the
					<span class="font-semibold">{currentPolarityOption?.label}</span>,
					<span class="font-semibold">{currentFormalityOption?.label}</span> form.
				</p>
				<p class="mt-2 text-sm text-gray-400">
					You have {remainingAttempts}
					{remainingAttempts === 1 ? 'attempt' : 'attempts'} for this question.
				</p>
			</div>

			<!-- User answer input -->
			<div class="mb-6">
				<div class="flex flex-col">
					<div class="flex">
						<input
							type="text"
							bind:value={userAnswer}
							bind:this={answerInput}
							on:keydown={handleKeyDown}
							placeholder={useRomaji
								? 'Enter your answer in romaji... (press Enter to submit)'
								: 'Enter your answer in Japanese... (press Enter to submit)'}
							class="flex-grow rounded-l-md border border-gray-600 bg-gray-700 p-3 text-white focus:ring focus:ring-indigo-500 focus:outline-none"
							disabled={isCorrect || showAnswer}
							autocomplete="off"
						/>
						<button
							on:click={checkUserAnswer}
							class="rounded-r-md bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:ring focus:ring-indigo-400 focus:outline-none"
							disabled={isCorrect || showAnswer}
						>
							Check
						</button>
					</div>

					<!-- Romaji conversion preview -->
					{#if useRomaji && convertedAnswer && !isCorrect && !showAnswer && remainingAttempts > 0}
						<div class="mt-2 text-gray-300">
							<span class="text-sm">Will be converted to:</span>
							<span class="ml-2 font-medium">{convertedAnswer}</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Feedback and answer -->
			{#if feedback}
				<div class="mb-6 text-center">
					<p class="text-lg font-semibold {isCorrect ? 'text-green-400' : 'text-red-400'}">
						{feedback}
					</p>

					{#if showAnswer && !isCorrect}
						<div class="mt-3">
							<p>
								The correct answer is: <span class="font-semibold">{correctAnswer}</span>
							</p>

							{#if hiraganaAnswer && hasKanji(correctAnswer)}
								<p class="mt-1 text-gray-400">
									(All hiragana: <span class="font-medium">{hiraganaAnswer}</span>)
								</p>
							{/if}

							<p class="mt-2 text-sm text-gray-400">
								Both kanji and hiragana answers are accepted!
							</p>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Next question button -->
			{#if isCorrect || showAnswer}
				<div class="text-center">
					<button
						on:click={newQuestion}
						class="rounded-md bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 focus:ring focus:ring-green-400 focus:outline-none"
					>
						Next Verb
					</button>
					<p class="mt-2 text-sm text-gray-400">(Press Enter to continue)</p>
				</div>
			{/if}
		{/if}
	</div>

	<!-- Score display -->
	<div class="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg">
		<div class="text-center">
			<h3 class="mb-3 text-xl font-semibold">Score</h3>
			<p class="text-2xl">
				{score} / {attempts}
				({attempts > 0 ? Math.round((score / attempts) * 100) : 0}%)
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

	<!-- Tense Performance Stats -->
	<div class="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg">
		<div class="text-center">
			<h3 class="mb-4 text-xl font-semibold">Tense Performance</h3>

			{#if totalTenseAttempts === 0}
				<p class="text-gray-400">Complete some questions to see your performance by tense.</p>
			{:else}
				<div class="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					{#each tenseOptions as tense}
						{#if tenseStats[tense.id].attempts > 0}
							<div class="rounded-md bg-gray-700 p-3">
								<div class="mb-1 flex items-center justify-between">
									<span class="font-medium">{tense.label}</span>
									<span class="text-sm">
										{tenseStats[tense.id].correct}/{tenseStats[tense.id].attempts}
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
</main>

<footer class="bg-gray-900 pt-4 pb-12 text-center text-gray-400">
	<p>Japanese Verb Conjugation Practice App</p>
	<p class="mt-1 text-sm">
		Created with Svelte and Tailwind CSS by <a
			href="https://github.com/andre-koga"
			target="_blank"
			class="text-indigo-400 hover:text-indigo-300">Andre Koga</a
		>
	</p>
</footer>
