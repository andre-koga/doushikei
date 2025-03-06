<script lang="ts">
	import { useRomaji, toggleRomajiMode } from '$lib/stores/preferenceStore';
</script>

<div class="mb-6 flex items-center justify-center">
	<button
		type="button"
		class="flex items-center rounded-md px-2 py-1 transition-colors {$useRomaji
			? 'bg-indigo-900 hover:bg-indigo-800'
			: 'bg-gray-700 hover:bg-gray-600'}"
		on:click={toggleRomajiMode}
	>
		<div
			class="relative flex h-4 w-8 items-center rounded-full p-0 transition-colors duration-300 ease-in-out {$useRomaji
				? 'bg-indigo-600'
				: 'bg-gray-400'}"
		>
			<!-- Toggle indicator -->
			<div
				class="absolute h-3 w-3 transform rounded-full bg-white shadow transition-transform duration-300 ease-in-out"
				style={$useRomaji ? 'transform: translateX(18px)' : 'transform: translateX(2px)'}
			></div>
		</div>
		<span
			class="ml-3 font-medium transition-colors duration-300 {$useRomaji
				? 'text-indigo-300'
				: 'text-gray-300'}"
		>
			{$useRomaji ? 'Romaji Input: ON' : 'Romaji Input: OFF'}
		</span>
	</button>
</div>
