<script lang="ts">
	import { tenseOptions } from '$lib/verbs';
	import { enabledTenses } from '$lib/stores/preferenceStore';
	import { toggleTense, toggleAllTenses, toggleEssentialTenses } from '$lib/stores/preferenceStore';

	// Group tenses by JLPT level
	const n5Tenses = ['present', 'past', 'teForm'];
	const n4Tenses = ['progressive', 'desire', 'volitional', 'potential', 'imperative'];
	const n3Tenses = ['passive', 'causative', 'conditionalBa', 'conditionalTara'];
	const n2Tenses = ['causativePassive', 'conditionalNara', 'conditionalTo', 'should', 'must'];
	const n1Tenses = [
		'attemptive',
		'preparatory',
		'regrettable',
		'giving',
		'receiving',
		'receivingFavor',
		'simultaneous',
		'purposeGoing',
		'purposeComing'
	];

	// Get tense options for each level
	$: n5Options = tenseOptions.filter((t) => n5Tenses.includes(t.id));
	$: n4Options = tenseOptions.filter((t) => n4Tenses.includes(t.id));
	$: n3Options = tenseOptions.filter((t) => n3Tenses.includes(t.id));
	$: n2Options = tenseOptions.filter((t) => n2Tenses.includes(t.id));
	$: n1Options = tenseOptions.filter((t) => n1Tenses.includes(t.id));
</script>

<div class="space-y-4 md:col-span-2">
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

	<!-- N5 Tenses -->
	<div class="space-y-2">
		<h4 class="text-sm font-medium text-violet-300">JLPT N5</h4>
		<div class="flex flex-wrap gap-2">
			{#each n5Options as option}
				<button
					class="tooltip rounded-md px-3 py-1 text-sm transition-colors {$enabledTenses.includes(
						option.id
					)
						? 'bg-violet-800/90 text-white hover:bg-violet-900/90'
						: 'bg-gray-700 text-white hover:bg-gray-600'}
					{option.essential ? 'order-0' : 'order-1'}
					"
					on:click={() => toggleTense(option.id)}
				>
					{option.label}
					<span class="text-xs text-gray-200">{option.description}</span>
					{#if option.longDescription}
						<span class="tooltiptext">{option.longDescription}</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- N4 Tenses -->
	<div class="space-y-2">
		<h4 class="text-sm font-medium text-blue-300">JLPT N4</h4>
		<div class="flex flex-wrap gap-2">
			{#each n4Options as option}
				<button
					class="tooltip rounded-md px-3 py-1 text-sm transition-colors {$enabledTenses.includes(
						option.id
					)
						? 'bg-blue-800/90 text-white hover:bg-blue-900/90'
						: 'bg-gray-700 text-white hover:bg-gray-600'}
					{option.essential ? 'order-0' : 'order-1'}
					"
					on:click={() => toggleTense(option.id)}
				>
					{option.label}
					<span class="text-xs text-gray-200">{option.description}</span>
					{#if option.longDescription}
						<span class="tooltiptext">{option.longDescription}</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- N3 Tenses -->
	<div class="space-y-2">
		<h4 class="text-sm font-medium text-emerald-300">JLPT N3</h4>
		<div class="flex flex-wrap gap-2">
			{#each n3Options as option}
				<button
					class="tooltip rounded-md px-3 py-1 text-sm transition-colors {$enabledTenses.includes(
						option.id
					)
						? 'bg-emerald-800/90 text-white hover:bg-emerald-900/90'
						: 'bg-gray-700 text-white hover:bg-gray-600'}
					{option.essential ? 'order-0' : 'order-1'}
					"
					on:click={() => toggleTense(option.id)}
				>
					{option.label}
					<span class="text-xs text-gray-200">{option.description}</span>
					{#if option.longDescription}
						<span class="tooltiptext">{option.longDescription}</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- N2 Tenses -->
	<div class="space-y-2">
		<h4 class="text-sm font-medium text-amber-300">JLPT N2</h4>
		<div class="flex flex-wrap gap-2">
			{#each n2Options as option}
				<button
					class="tooltip rounded-md px-3 py-1 text-sm transition-colors {$enabledTenses.includes(
						option.id
					)
						? 'bg-amber-800/70 text-white hover:bg-amber-900/70'
						: 'bg-gray-700 text-white hover:bg-gray-600'}
					{option.essential ? 'order-0' : 'order-1'}
					"
					on:click={() => toggleTense(option.id)}
				>
					{option.label}
					<span class="text-xs text-gray-200">{option.description}</span>
					{#if option.longDescription}
						<span class="tooltiptext">{option.longDescription}</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- N1 Tenses -->
	<div class="space-y-2">
		<h4 class="text-sm font-medium text-red-300">JLPT N1</h4>
		<div class="flex flex-wrap gap-2">
			{#each n1Options as option}
				<button
					class="tooltip rounded-md px-3 py-1 text-sm transition-colors {$enabledTenses.includes(
						option.id
					)
						? 'bg-red-800/70 text-white hover:bg-red-900/70'
						: 'bg-gray-700 text-white hover:bg-gray-600'}
					{option.essential ? 'order-0' : 'order-1'}
					"
					on:click={() => toggleTense(option.id)}
				>
					{option.label}
					<span class="text-xs text-gray-200">{option.description}</span>
					{#if option.longDescription}
						<span class="tooltiptext">{option.longDescription}</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<div class="mt-1 text-xs text-gray-300">
		{$enabledTenses.length} of {tenseOptions.length} selected
		<span class="ml-2 italic"
			>(Note: Present Affirmative Plain will be skipped when randomizing as it's the dictionary
			form)</span
		>
	</div>
</div>
