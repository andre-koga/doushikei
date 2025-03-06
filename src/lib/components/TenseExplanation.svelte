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
							<span class="font-medium">Godan verbs:</span> The ending changes based on the final
							kana:
							<table class="mt-1 border-collapse text-sm">
								<tbody>
									<tr class="border-b border-gray-600">
										<td class="pr-3 font-medium">Ending</td>
										<td class="pr-3 font-medium">Change to</td>
										<td class="font-medium">Example</td>
									</tr>
									<tr class="border-b border-gray-600">
										<td class="pr-3">う, つ, る</td>
										<td class="pr-3">った</td>
										<td>買う → 買った (kau → katta)</td>
									</tr>
									<tr class="border-b border-gray-600">
										<td class="pr-3">ぶ, む, ぬ</td>
										<td class="pr-3">んだ</td>
										<td>読む → 読んだ (yomu → yonda)</td>
									</tr>
									<tr class="border-b border-gray-600">
										<td class="pr-3">く</td>
										<td class="pr-3">いた</td>
										<td>書く → 書いた (kaku → kaita)</td>
									</tr>
									<tr class="border-b border-gray-600">
										<td class="pr-3">ぐ</td>
										<td class="pr-3">いだ</td>
										<td>泳ぐ → 泳いだ (oyogu → oyoida)</td>
									</tr>
									<tr>
										<td class="pr-3">す</td>
										<td class="pr-3">した</td>
										<td>話す → 話した (hanasu → hanashita)</td>
									</tr>
								</tbody>
							</table>
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
							<span class="font-medium">Godan verbs:</span> The ending changes based on the final
							kana:
							<table class="mt-1 border-collapse text-sm">
								<tbody>
									<tr class="border-b border-gray-600">
										<td class="pr-3 font-medium">Ending</td>
										<td class="pr-3 font-medium">Change to</td>
										<td class="font-medium">Example</td>
									</tr>
									<tr class="border-b border-gray-600">
										<td class="pr-3">う, つ, る</td>
										<td class="pr-3">って</td>
										<td>買う → 買って (kau → katte)</td>
									</tr>
									<tr class="border-b border-gray-600">
										<td class="pr-3">ぶ, む, ぬ</td>
										<td class="pr-3">んで</td>
										<td>読む → 読んで (yomu → yonde)</td>
									</tr>
									<tr class="border-b border-gray-600">
										<td class="pr-3">く</td>
										<td class="pr-3">いて</td>
										<td>書く → 書いて (kaku → kaite)</td>
									</tr>
									<tr class="border-b border-gray-600">
										<td class="pr-3">ぐ</td>
										<td class="pr-3">いで</td>
										<td>泳ぐ → 泳いで (oyogu → oyoide)</td>
									</tr>
									<tr>
										<td class="pr-3">す</td>
										<td class="pr-3">して</td>
										<td>話す → 話して (hanasu → hanashite)</td>
									</tr>
								</tbody>
							</table>
						</li>
					</ul>
					<p class="mt-2 text-sm">
						The te-form is a connector form and doesn't have "negative" forms on its own. Instead,
						use ないで for negative requests.
					</p>
				</div>
			{:else if $currentTense === 'potential'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li><span class="font-medium">Ichidan verbs:</span> Remove る and add られる</li>
						<li><span class="font-medium">Godan verbs:</span> Change to え-row + る</li>
						<li>
							<span class="font-medium">Negative plain:</span> Add ない to the potential form (e.g.,
							食べられない, 行けない)
						</li>
						<li>
							<span class="font-medium">Polite form:</span> Add ます to the stem of the potential
							form
							<br /><span class="text-sm"
								>(e.g., 食べられ<span class="underline">ます</span>, 行け<span class="underline"
									>ます</span
								>)</span
							>
						</li>
					</ul>
				</div>
			{:else if $currentTense === 'passive'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li><span class="font-medium">Ichidan verbs:</span> Remove る and add られる</li>
						<li><span class="font-medium">Godan verbs:</span> Change to あ-row + れる</li>
						<li>
							<span class="font-medium">Negative plain:</span> Add ない to the passive form (e.g., 食べられない,
							見られない)
						</li>
						<li>
							<span class="font-medium">Polite form:</span> Add ます to the stem of the passive form
							<br /><span class="text-sm"
								>(e.g., 食べられ<span class="underline">ます</span>, 見られ<span class="underline"
									>ます</span
								>)</span
							>
						</li>
					</ul>
					<p class="mt-2">
						The passive form can also express adversity, when something undesirable happens to the
						subject.
					</p>
				</div>
			{:else if $currentTense === 'causative'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li><span class="font-medium">Ichidan verbs:</span> Remove る and add させる</li>
						<li><span class="font-medium">Godan verbs:</span> Change to あ-row + せる</li>
						<li>
							<span class="font-medium">Negative plain:</span> Add ない to the causative form (e.g.,
							食べさせない, 行かせない)
						</li>
						<li>
							<span class="font-medium">Polite form:</span> Add ます to the stem of the causative
							form
							<br /><span class="text-sm"
								>(e.g., 食べさせ<span class="underline">ます</span>, 行かせ<span class="underline"
									>ます</span
								>)</span
							>
						</li>
					</ul>
					<p class="mt-2">
						The causative can express either making someone do something (coercion) or letting
						someone do something (permission).
					</p>
				</div>
			{:else if $currentTense === 'imperative'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li><span class="font-medium">Ichidan verbs (plain):</span> Remove る and add ろ</li>
						<li><span class="font-medium">Godan verbs (plain):</span> Change to え-row</li>
						<li><span class="font-medium">Polite form:</span> Use て-form + ください</li>
						<li><span class="font-medium">Negative command:</span> Use ないで + ください</li>
					</ul>
					<p class="mt-2">
						The plain imperative form can sound very harsh and is typically only used among close
						friends, for emergencies, or in military contexts.
					</p>
				</div>
			{:else if $currentTense === 'volitional'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li><span class="font-medium">Ichidan verbs (plain):</span> Remove る and add よう</li>
						<li><span class="font-medium">Godan verbs (plain):</span> Change to お-row + う</li>
						<li><span class="font-medium">Polite form:</span> Add ましょう to the stem</li>
						<li>
							<span class="font-medium">Negative expression:</span> まい is literary and rarely used
							in modern Japanese. Instead, use negative form + つもりだ for "I won't..." or やめよう/やめましょう
							for "Let's not..."
						</li>
					</ul>
				</div>
			{:else if $currentTense === 'conditionalBa'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li><span class="font-medium">For verbs:</span> Change to え-row + ば</li>
						<li><span class="font-medium">For negative:</span> Use なければ</li>
					</ul>
					<p class="mt-2">
						The ba-conditional is used for hypothetical conditions and tends to express natural
						consequences or general truths. It's often used for situations where the result is
						almost always true when the condition is met.
					</p>
					<p class="mt-1 text-sm">
						Example: このボタンを押せば、ドアが開きます。
						<br />(If you push this button, the door opens.) - a general/natural consequence
					</p>
				</div>
			{:else if $currentTense === 'conditionalTara'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li><span class="font-medium">All verbs:</span> Past tense + ら</li>
						<li><span class="font-medium">For negative:</span> Past negative + ら</li>
					</ul>
					<p class="mt-2">
						The tara-conditional has a sequential nuance ("when/after") and can express surprise
						discoveries. Unlike the ば conditional, it's often used for specific instances or
						time-related conditions.
					</p>
					<p class="mt-1 text-sm">
						Example: 日本に行ったら、富士山を見に行きたいです。
						<br />(When I go to Japan, I want to see Mt. Fuji.) - specific future instance
					</p>
				</div>
			{:else if $currentTense === 'progressive'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li>
							<span class="font-medium">All verbs:</span> Te-form + いる (plain) or います (polite)
						</li>
						<li><span class="font-medium">Negative:</span> Te-form + いない or いません</li>
						<li><span class="font-medium">Past:</span> Te-form + いた or いました</li>
					</ul>
					<p class="mt-2">
						The progressive form can express both ongoing actions and resultant states, depending on
						the verb.
					</p>
				</div>
			{:else if $currentTense === 'desire'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li>
							<span class="font-medium">All verbs:</span> Stem + たい (plain) or たいです (polite)
						</li>
						<li><span class="font-medium">Negative:</span> Stem + たくない or たくないです</li>
						<li><span class="font-medium">Past:</span> Stem + たかった or たかったです</li>
					</ul>
					<p class="mt-2">
						The desire form conjugates like an i-adjective and is typically used for first-person
						desires.
					</p>
				</div>
			{:else if $currentTense === 'causativePassive'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li><span class="font-medium">Ichidan verbs:</span> Remove る and add させられる</li>
						<li><span class="font-medium">Godan verbs:</span> Change to あ-row + せられる</li>
						<li>
							<span class="font-medium">Colloquial forms:</span> Often shortened (e.g., 食べさせられる
							→ 食べさせられる)
						</li>
					</ul>
					<p class="mt-2">
						The causative-passive expresses being forced to do something, often with a nuance of
						inconvenience.
					</p>
				</div>
			{:else if $currentTense === 'conditionalNara'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li><span class="font-medium">All forms:</span> Any form of verb + なら</li>
						<li>
							<span class="font-medium">Common uses:</span> With dictionary form, present tense, or past
							tense
						</li>
					</ul>
					<p class="mt-2">
						The nara-conditional is used for situational conditions and often refers to information
						just learned.
					</p>
				</div>
			{:else if $currentTense === 'conditionalTo'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li><span class="font-medium">All verbs:</span> Dictionary form + と</li>
						<li><span class="font-medium">Negative form:</span> Negative form + と</li>
						<li>
							<span class="font-medium">Restriction:</span> Cannot be used with requests, commands, or
							suggestions in the result clause
						</li>
					</ul>
					<p class="mt-2">
						The to-conditional expresses natural consequences and automatic results. It indicates
						that whenever the condition is met, the result always follows without exception.
					</p>
					<p class="mt-1 text-sm">
						Example: 冬になると、雪が降ります。
						<br />(When winter comes, it snows.) - natural/automatic consequence
					</p>
				</div>
			{:else if $currentTense === 'should'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li>
							<span class="font-medium">All verbs:</span> Dictionary form + べき (plain) or べきです
							(polite)
						</li>
						<li>
							<span class="font-medium">Negative:</span> Dictionary form + べきではない or べきではありません
						</li>
						<li>
							<span class="font-medium">Past:</span> Dictionary form + べきだった or べきでした
						</li>
					</ul>
					<p class="mt-2">The "should" form expresses moral obligation or proper behavior.</p>
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
			{:else if $currentTense === 'attemptive'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li>
							<span class="font-medium">All verbs:</span> Te-form + みる (plain) or みます (polite)
						</li>
						<li><span class="font-medium">Negative:</span> Te-form + みない or みません</li>
						<li><span class="font-medium">Past:</span> Te-form + みた or みました</li>
					</ul>
					<p class="mt-2">
						The attemptive form expresses trying or testing an action to see the result.
					</p>
				</div>
			{:else if $currentTense === 'preparatory'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li>
							<span class="font-medium">All verbs:</span> Te-form + おく (plain) or おきます (polite)
						</li>
						<li><span class="font-medium">Negative:</span> Te-form + おかない or おきません</li>
						<li><span class="font-medium">Past:</span> Te-form + おいた or おきました</li>
					</ul>
					<p class="mt-2">
						The preparatory form expresses doing something in advance or as preparation.
					</p>
				</div>
			{:else if $currentTense === 'regrettable'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li>
							<span class="font-medium">All verbs:</span> Te-form + しまう (plain) or しまいます (polite)
						</li>
						<li><span class="font-medium">Negative:</span> Te-form + しまわない or しまいません</li>
						<li><span class="font-medium">Past:</span> Te-form + しまった or しまいました</li>
						<li>
							<span class="font-medium">Colloquial:</span> Often contracted to ~ちゃう/~じゃう (plain)
							or ~ちゃいます/~じゃいます (polite)
						</li>
					</ul>
					<p class="mt-2">
						The regrettable form expresses completing an action, often with a nuance of regret or
						finality.
					</p>
				</div>
			{:else if $currentTense === 'giving'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li>
							<span class="font-medium">All verbs:</span> Te-form + あげる (plain) or あげます (polite)
						</li>
						<li>
							<span class="font-medium">More formal:</span> Te-form + さしあげる or さしあげます
						</li>
						<li><span class="font-medium">Negative:</span> Te-form + あげない or あげません</li>
					</ul>
					<p class="mt-2">The giving form expresses doing something for someone else's benefit.</p>
				</div>
			{:else if $currentTense === 'receiving'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li>
							<span class="font-medium">All verbs:</span> Te-form + くれる (plain) or くれます (polite)
						</li>
						<li><span class="font-medium">Negative:</span> Te-form + くれない or くれません</li>
						<li><span class="font-medium">Past:</span> Te-form + くれた or くれました</li>
					</ul>
					<p class="mt-2">
						The receiving form expresses someone doing something for the speaker's benefit.
					</p>
				</div>
			{:else if $currentTense === 'receivingFavor'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li>
							<span class="font-medium">All verbs:</span> Te-form + もらう (plain) or もらいます (polite)
						</li>
						<li>
							<span class="font-medium">More formal:</span> Te-form + いただく or いただきます
						</li>
						<li><span class="font-medium">Negative:</span> Te-form + もらわない or もらいません</li>
					</ul>
					<p class="mt-2">
						The receiving favor form indicates receiving the favor of someone's action, emphasizing
						the receiver's viewpoint.
					</p>
				</div>
			{:else if $currentTense === 'simultaneous'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li><span class="font-medium">All verbs:</span> Stem + ながら</li>
						<li><span class="font-medium">Negative:</span> Rarely used in negative form</li>
						<li>
							<span class="font-medium">Note:</span> The main action comes after the ながら phrase
						</li>
					</ul>
					<p class="mt-2">
						The simultaneous form expresses doing two actions at the same time, with the ながら
						action being subordinate.
					</p>
				</div>
			{:else if $currentTense === 'purposeGoing'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li>
							<span class="font-medium">All verbs:</span> Dictionary form + に行く (plain) or に行きます
							(polite)
						</li>
						<li>
							<span class="font-medium">Past:</span> Dictionary form + に行った or に行きました
						</li>
						<li>
							<span class="font-medium">Negative:</span> Dictionary form + に行かない or に行きません
						</li>
					</ul>
					<p class="mt-2">
						The purpose going form expresses going somewhere to perform a specific action.
					</p>
				</div>
			{:else if $currentTense === 'purposeComing'}
				<div>
					<p class="mb-1 font-medium">Formation:</p>
					<ul class="list-disc pl-5">
						<li>
							<span class="font-medium">All verbs:</span> Dictionary form + に来る (plain) or に来ます
							(polite)
						</li>
						<li><span class="font-medium">Past:</span> Dictionary form + に来た or に来ました</li>
						<li>
							<span class="font-medium">Negative:</span> Dictionary form + に来ない or に来ません
						</li>
					</ul>
					<p class="mt-2">
						The purpose coming form expresses coming somewhere to perform a specific action, with
						movement toward the speaker.
					</p>
				</div>
			{/if}

			<div>
				<p class="font-medium">Examples:</p>
				{#if $currentTense === 'present'}
					<ul class="list-disc pl-5">
						<li>食べる → 食べます (taberu → tabemasu) (I eat/will eat)</li>
						<li>行く → 行きます (iku → ikimasu) (I go/will go)</li>
						<li>見る → 見ない/見ません (miru → minai/mimasen) (I don't see/won't see)</li>
					</ul>
				{:else if $currentTense === 'past'}
					<ul class="list-disc pl-5">
						<li>食べる → 食べた/食べました (taberu → tabeta/tabemashita) (I ate)</li>
						<li>行く → 行った/行きました (iku → itta/ikimashita) (I went)</li>
						<li>
							見る → 見なかった/見ませんでした (miru → minakatta/mimasendeshita) (I didn't see)
						</li>
					</ul>
				{:else if $currentTense === 'teForm'}
					<ul class="list-disc pl-5">
						<li>食べる → 食べて (taberu → tabete) (used in: 食べてください - Please eat)</li>
						<li>行く → 行って (iku → itte) (used in: 行っている - I am going)</li>
						<li>読む → 読んで (yomu → yonde) (used in: 読んでみる - Try reading)</li>
					</ul>
				{:else if $currentTense === 'potential'}
					<ul class="list-disc pl-5">
						<li>食べる → 食べられる/食べられます (taberu → taberareru/taberaremasu) (I can eat)</li>
						<li>行く → 行ける/行けます (iku → ikeru/ikemasu) (I can go)</li>
						<li>見る → 見られない/見られません (miru → mirarenai/mirarenai) (I cannot see)</li>
					</ul>
				{:else if $currentTense === 'passive'}
					<ul class="list-disc pl-5">
						<li>
							食べる → 食べられる/食べられます (taberu → taberareru/taberaremasu) (It is eaten)
						</li>
						<li>見る → 見られる/見られます (miru → mirareru/miraremasu) (It is seen)</li>
						<li>
							叩く → 叩かれる/叩かれます (tataku → tatakareru/tatakaremasu) (I was hit - adversity)
						</li>
					</ul>
				{:else if $currentTense === 'causative'}
					<ul class="list-disc pl-5">
						<li>
							食べる → 食べさせる/食べさせます (taberu → tabesaseru/tabesasemasu) (Make someone eat)
						</li>
						<li>行く → 行かせる/行かせます (iku → ikaseru/ikasemasu) (Let someone go)</li>
						<li>
							働く → 働かせる/働かせます (hataraku → hatarakaseru/hatarakasemasu) (Make someone
							work)
						</li>
					</ul>
				{:else if $currentTense === 'imperative'}
					<ul class="list-disc pl-5">
						<li>食べる → 食べろ/食べてください (taberu → tabero/tabete kudasai) (Eat!)</li>
						<li>行く → 行け/行ってください (iku → ike/itte kudasai) (Go!)</li>
						<li>来る → 来い/来てください (kuru → koi/kite kudasai) (Come!)</li>
					</ul>
				{:else if $currentTense === 'volitional'}
					<ul class="list-disc pl-5">
						<li>食べる → 食べよう/食べましょう (taberu → tabeyou/tabemashō) (Let's eat)</li>
						<li>行く → 行こう/行きましょう (iku → ikō/ikimashō) (Let's go)</li>
						<li>
							勉強する → 勉強しよう/勉強しましょう (benkyō suru → benkyō shiyō/benkyō shimashō)
							(Let's study)
						</li>
					</ul>
				{:else if $currentTense === 'conditionalBa'}
					<ul class="list-disc pl-5">
						<li>食べる → 食べれば (taberu → tabereba) (If I eat)</li>
						<li>行く → 行けば (iku → ikeba) (If I go)</li>
						<li>高い → 高ければ (takai → takakereba) (If it's expensive)</li>
					</ul>
				{:else if $currentTense === 'conditionalTara'}
					<ul class="list-disc pl-5">
						<li>食べる → 食べたら (taberu → tabetara) (If/when I eat)</li>
						<li>行く → 行ったら (iku → ittara) (If/when I go)</li>
						<li>寝る → 寝たら (neru → netara) (If/when I sleep)</li>
					</ul>
				{:else if $currentTense === 'progressive'}
					<ul class="list-disc pl-5">
						<li>
							食べる → 食べている/食べています (taberu → tabete iru/tabete imasu) (I am eating)
						</li>
						<li>行く → 行っている/行っています (iku → itte iru/itte imasu) (I am going)</li>
						<li>
							結婚する → 結婚している/結婚しています (kekkon suru → kekkon shite iru/kekkon shite
							imasu) (I am married - resultant state)
						</li>
					</ul>
				{:else if $currentTense === 'desire'}
					<ul class="list-disc pl-5">
						<li>食べる → 食べたい/食べたいです (taberu → tabetai/tabetai desu) (I want to eat)</li>
						<li>行く → 行きたい/行きたいです (iku → ikitai/ikitai desu) (I want to go)</li>
						<li>
							見る → 見たくない/見たくないです (miru → mitakunai/mitakunai desu) (I don't want to
							see)
						</li>
					</ul>
				{:else if $currentTense === 'causativePassive'}
					<ul class="list-disc pl-5">
						<li>
							食べる → 食べさせられる/食べさせられます (taberu → tabesaserareru/tabesaseraremasu) (I
							am made to eat)
						</li>
						<li>
							行く → 行かせられる/行かせられます (iku → ikaserareru/ikaseraremasu) (I am made to go)
						</li>
						<li>
							待つ → 待たせられる/待たせられます (matsu → mataserareru/mataseraremasu) (I am made to
							wait)
						</li>
					</ul>
				{:else if $currentTense === 'conditionalNara'}
					<ul class="list-disc pl-5">
						<li>行く → 行くなら (iku → iku nara) (If you're going)</li>
						<li>雨 → 雨なら (ame → ame nara) (If it's raining)</li>
						<li>忙しい → 忙しいなら (isogashii → isogashii nara) (If you're busy)</li>
					</ul>
				{:else if $currentTense === 'conditionalTo'}
					<ul class="list-disc pl-5">
						<li>押す → 押すと、開く (osu → osu to, hiraku) (If you push it, it opens)</li>
						<li>
							触る → 触ると、壊れる (sawaru → sawaru to, kowareru) (If you touch it, it breaks)
						</li>
						<li>
							学ぶ → 学ぶと、分かる (manabu → manabu to, wakaru) (If you study, you understand)
						</li>
					</ul>
				{:else if $currentTense === 'should'}
					<ul class="list-disc pl-5">
						<li>
							勉強する → 勉強するべき/勉強するべきです (benkyō suru → benkyō suru beki/benkyō suru
							beki desu) (I should study)
						</li>
						<li>
							行く → 行くべきではない/行くべきではありません (iku → iku beki dewa nai/iku beki dewa
							arimasen) (I should not go)
						</li>
						<li>
							読む → 読むべきだった/読むべきでした (yomu → yomu beki datta/yomu beki deshita) (I
							should have read it)
						</li>
					</ul>
				{:else if $currentTense === 'must'}
					<ul class="list-disc pl-5">
						<li>
							食べる → 食べなければならない/食べなければなりません (taberu → tabenakereba
							naranai/tabenakereba narimasen) (I must eat)
						</li>
						<li>
							行く → 行かなくてもいい/行かなくてもいいです (iku → ikanakutemo ii/ikanakutemo ii
							desu) (I don't have to go)
						</li>
						<li>
							勉強する → 勉強しなければならない/勉強しなければなりません (benkyō suru → benkyō
							shinakereba naranai/benkyō shinakereba narimasen) (I must study)
						</li>
					</ul>
				{:else if $currentTense === 'attemptive'}
					<ul class="list-disc pl-5">
						<li>
							食べる → 食べてみる/食べてみます (taberu → tabete miru/tabete mimasu) (Try eating)
						</li>
						<li>行く → 行ってみる/行ってみます (iku → itte miru/itte mimasu) (Try going)</li>
						<li>
							話す → 話してみる/話してみます (hanasu → hanashite miru/hanashite mimasu) (Try
							speaking)
						</li>
					</ul>
				{:else if $currentTense === 'preparatory'}
					<ul class="list-disc pl-5">
						<li>
							買う → 買っておく/買っておきます (kau → katte oku/katte okimasu) (Buy in advance)
						</li>
						<li>
							調べる → 調べておく/調べておきます (shiraberu → shirabete oku/shirabete okimasu)
							(Check/research beforehand)
						</li>
						<li>
							準備する → 準備しておく/準備しておきます (junbi suru → junbi shite oku/junbi shite
							okimasu) (Prepare ahead of time)
						</li>
					</ul>
				{:else if $currentTense === 'regrettable'}
					<ul class="list-disc pl-5">
						<li>
							忘れる → 忘れてしまう/忘れてしまいます (wasureru → wasurete shimau/wasurete
							shimaimasu) (Forget completely)
						</li>
						<li>
							落とす → 落としてしまう/落としてしまいます (otosu → otoshite shimau/otoshite
							shimaimasu) (Drop accidentally)
						</li>
						<li>
							食べる → 食べてしまった/食べてしまいました (taberu → tabete shimatta/tabete
							shimaimashita) (I've eaten it all up)
						</li>
					</ul>
				{:else if $currentTense === 'giving'}
					<ul class="list-disc pl-5">
						<li>
							教える → 教えてあげる/教えてあげます (oshieru → oshiete ageru/oshiete agemasu) (Teach
							for someone else's benefit)
						</li>
						<li>
							手伝う → 手伝ってあげる/手伝ってあげます (tetsudau → tetsudatte ageru/tetsudatte
							agemasu) (Help someone)
						</li>
						<li>
							説明する → 説明してあげる/説明してあげます (setsumei suru → setsumei shite
							ageru/setsumei shite agemasu) (Explain for someone)
						</li>
					</ul>
				{:else if $currentTense === 'receiving'}
					<ul class="list-disc pl-5">
						<li>
							教える → 教えてくれる/教えてくれます (oshieru → oshiete kureru/oshiete kuremasu)
							(Someone teaches me)
						</li>
						<li>
							作る → 作ってくれた/作ってくれました (tsukuru → tsukutte kureta/tsukutte kuremashita)
							(Someone made it for me)
						</li>
						<li>
							送る → 送ってくれる/送ってくれます (okuru → okutte kureru/okutte kuremasu) (Someone
							sends it for me)
						</li>
					</ul>
				{:else if $currentTense === 'receivingFavor'}
					<ul class="list-disc pl-5">
						<li>
							教える → 教えてもらう/教えてもらいます (oshieru → oshiete morau/oshiete moraimasu) (I
							receive the favor of being taught)
						</li>
						<li>
							手伝う → 手伝ってもらう/手伝ってもらいます (tetsudau → tetsudatte morau/tetsudatte
							moraimasu) (I receive help from someone)
						</li>
						<li>
							作る → 作ってもらった/作ってもらいました (tsukuru → tsukutte moratta/tsukutte
							moraimashita) (I had someone make it for me)
						</li>
					</ul>
				{:else if $currentTense === 'simultaneous'}
					<ul class="list-disc pl-5">
						<li>
							食べる → 食べながら、テレビを見る/見ます (taberu → taberu nagara, terebi o
							miru/mimasu) (Watch TV while eating)
						</li>
						<li>
							歩く → 歩きながら、話す/話します (aruku → aruki nagara, hanasu/hanashimasu) (Talk
							while walking)
						</li>
						<li>
							笑う → 笑いながら、話す/話します (warau → warai nagara, hanasu/hanashimasu) (Speak
							while laughing)
						</li>
					</ul>
				{:else if $currentTense === 'purposeGoing'}
					<ul class="list-disc pl-5">
						<li>
							食べる → 食べに行く/食べに行きます (taberu → tabe ni iku/tabe ni ikimasu) (Go to eat)
						</li>
						<li>買う → 買いに行く/買いに行きます (kau → kai ni iku/kai ni ikimasu) (Go to buy)</li>
						<li>
							遊ぶ → 遊びに行く/遊びに行きます (asobu → asobi ni iku/asobi ni ikimasu) (Go to
							play/hang out)
						</li>
					</ul>
				{:else if $currentTense === 'purposeComing'}
					<ul class="list-disc pl-5">
						<li>会う → 会いに来る/会いに来ます (au → ai ni kuru/ai ni kimasu) (Come to meet)</li>
						<li>
							手伝う → 手伝いに来る/手伝いに来ます (tetsudau → tetsudai ni kuru/tetsudai ni kimasu)
							(Come to help)
						</li>
						<li>
							勉強する → 勉強しに来る/勉強しに来ます (benkyō suru → benkyō shi ni kuru/benkyō shi ni
							kimasu) (Come to study)
						</li>
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
