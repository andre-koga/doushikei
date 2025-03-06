<script lang="ts">
	import { tenseOptions } from '$lib/verbs';
	import { currentTense, isCorrect, showAnswer } from '$lib/stores/gameStore';

	$: currentTenseOption = tenseOptions.find((t) => t.id === $currentTense);
</script>

{#if $isCorrect || $showAnswer}
	<div class="mb-6 rounded-lg bg-gray-700 p-4 text-left">
		<h4
			class="mb-2 border-b border-gray-600 pb-2 text-center text-lg font-semibold text-indigo-300"
		>
			About {currentTenseOption?.label}
			<span class="text-sm text-gray-400">({currentTenseOption?.description})</span>
		</h4>

		<div class="space-y-3">
			<p>{currentTenseOption?.longDescription}</p>

			{#if $currentTense === 'present'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li><span class="font-medium">Ichidan verbs:</span> Remove る and add ます (polite)</li>
						<li>
							<span class="font-medium">Godan verbs:</span> Change last kana to い-row + ます (polite)
						</li>
						<li><span class="font-medium">Negative plain:</span> Change to あ-row + ない</li>
						<li><span class="font-medium">Negative polite:</span> Change to い-row + ません</li>
					</ul>
				</div>
			{:else if $currentTense === 'past'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li>
							<span class="font-medium">Ichidan verbs:</span> Remove る and add た (plain) or ました
							(polite)
						</li>
						<li>
							<span class="font-medium">Godan verbs:</span> Change last kana according to consonant endings
						</li>
						<li><span class="font-medium">Negative plain:</span> Change to あ-row + なかった</li>
						<li>
							<span class="font-medium">Negative polite:</span> Change to い-row + ませんでした
						</li>
					</ul>
				</div>
			{:else if $currentTense === 'teForm'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li><span class="font-medium">Ichidan verbs:</span> Remove る and add て</li>
						<li>
							<span class="font-medium">Godan verbs ending in う, つ, る:</span> Change to って
						</li>
						<li>
							<span class="font-medium">Godan verbs ending in む, ぶ, ぬ:</span> Change to んで
						</li>
						<li><span class="font-medium">Godan verbs ending in く:</span> Change to いて</li>
						<li><span class="font-medium">Godan verbs ending in ぐ:</span> Change to いで</li>
						<li><span class="font-medium">Godan verbs ending in す:</span> Change to して</li>
					</ul>
				</div>
			{:else if $currentTense === 'potential'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li><span class="font-medium">Ichidan verbs:</span> Remove る and add られる</li>
						<li><span class="font-medium">Godan verbs:</span> Change to え-row + る</li>
						<li><span class="font-medium">Negative:</span> Add ない to the potential form</li>
						<li>
							<span class="font-medium">Polite:</span> Add ます to the stem of the potential form
						</li>
					</ul>
				</div>
			{:else if $currentTense === 'must'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li>
							<span class="font-medium">Affirmative:</span> Negative conditional + ならない (plain) or
							なりません (polite)
						</li>
						<li>
							<span class="font-medium">Negative (don't have to):</span> Negative conditional + なくてもいい
							(plain) or なくてもいいです (polite)
						</li>
						<li>
							Both forms なければならない and なければなりません are commonly used and accepted.
						</li>
					</ul>
					<p class="mt-2">
						Unlike English, Japanese forms the negative of "must" as "don't have to" rather than
						"must not".
					</p>
				</div>
			{:else}
				<div>
					<p class="mb-1 font-medium">Usage:</p>
					<p>
						This form is one of many Japanese verb conjugations. Practice regularly to master it
						along with other forms.
					</p>
				</div>
			{/if}

			<div>
				<p class="font-medium">Examples:</p>
				{#if $currentTense === 'present'}
					<ul class="list-disc pl-5">
						<li>食べる → 食べます (I eat/will eat)</li>
						<li>行く → 行きます (I go/will go)</li>
						<li>見る → 見ない (I don't see/won't see)</li>
					</ul>
				{:else if $currentTense === 'past'}
					<ul class="list-disc pl-5">
						<li>食べる → 食べた/食べました (I ate)</li>
						<li>行く → 行った/行きました (I went)</li>
						<li>見る → 見なかった (I didn't see)</li>
					</ul>
				{:else if $currentTense === 'teForm'}
					<ul class="list-disc pl-5">
						<li>食べる → 食べて (used in: 食べてください - Please eat)</li>
						<li>行く → 行って (used in: 行っている - I am going)</li>
						<li>読む → 読んで (used in: 読んでみる - Try reading)</li>
					</ul>
				{:else if $currentTense === 'potential'}
					<ul class="list-disc pl-5">
						<li>食べる → 食べられる (I can eat)</li>
						<li>行く → 行ける (I can go)</li>
						<li>見る → 見られない (I cannot see)</li>
					</ul>
				{:else if $currentTense === 'must'}
					<ul class="list-disc pl-5">
						<li>食べる → 食べなければならない/食べなければなりません (I must eat)</li>
						<li>行く → 行かなくてもいい (I don't have to go)</li>
						<li>勉強する → 勉強しなければならない (I must study)</li>
					</ul>
				{:else if $currentTense === 'volitional'}
					<ul class="list-disc pl-5">
						<li>食べる → 食べよう (Let's eat)</li>
						<li>行く → 行こう (Let's go)</li>
						<li>勉強する → 勉強しよう (Let's study)</li>
					</ul>
				{:else}
					<ul class="list-disc pl-5">
						<li>Keep practicing to become more familiar with this form!</li>
					</ul>
				{/if}
			</div>

			<p class="border-t border-gray-600 pt-2 text-sm text-gray-400">
				Remember: Regular practice with different verbs will help you master this conjugation
				pattern.
			</p>
		</div>
	</div>
{/if}
