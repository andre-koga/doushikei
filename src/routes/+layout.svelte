<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-screen bg-gray-900">
	<p class="bg-red-400 px-2 py-1.5 text-center text-sm">This app is still under development!</p>
	<nav class="bg-gray-800 shadow">
		<div class="container mx-auto px-4 py-3">
			<div class="flex items-center justify-between">
				<a href="/" class="text-xl font-bold text-gray-100">日本語動詞活用練習</a>
				<div class="flex space-x-4">
					<a href="/" class="text-gray-300 hover:text-white">Practice</a>
					<a href="/verb/n5" class="text-gray-300 hover:text-white">N5</a>
					<a href="/verb/n4" class="text-gray-300 hover:text-white">N4</a>
					<a href="/verb/n3" class="text-gray-300 hover:text-white">N3</a>
					<a href="/verb/n2" class="text-gray-300 hover:text-white">N2</a>
					<a href="/verb/n1" class="text-gray-300 hover:text-white">N1</a>
				</div>
			</div>
		</div>
	</nav>

	<main class="container mx-auto max-w-4xl px-4 py-8">
		{@render children()}
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
</div>
