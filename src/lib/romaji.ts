// Map of romaji to hiragana conversions
const romajiToHiragana: Record<string, string> = {
	// Basic hiragana
	a: 'あ',
	i: 'い',
	u: 'う',
	e: 'え',
	o: 'お',
	ka: 'か',
	ki: 'き',
	ku: 'く',
	ke: 'け',
	ko: 'こ',
	sa: 'さ',
	shi: 'し',
	su: 'す',
	se: 'せ',
	so: 'そ',
	ta: 'た',
	chi: 'ち',
	tsu: 'つ',
	te: 'て',
	to: 'と',
	na: 'な',
	ni: 'に',
	nu: 'ぬ',
	ne: 'ね',
	no: 'の',
	ha: 'は',
	hi: 'ひ',
	fu: 'ふ',
	he: 'へ',
	ho: 'ほ',
	ma: 'ま',
	mi: 'み',
	mu: 'む',
	me: 'め',
	mo: 'も',
	ya: 'や',
	yu: 'ゆ',
	yo: 'よ',
	ra: 'ら',
	ri: 'り',
	ru: 'る',
	re: 'れ',
	ro: 'ろ',
	wa: 'わ',
	wo: 'を',
	n: 'ん',

	// Dakuten variants
	ga: 'が',
	gi: 'ぎ',
	gu: 'ぐ',
	ge: 'げ',
	go: 'ご',
	za: 'ざ',
	ji: 'じ',
	zu: 'ず',
	ze: 'ぜ',
	zo: 'ぞ',
	da: 'だ',
	di: 'ぢ',
	du: 'づ',
	de: 'で',
	do: 'ど',
	ba: 'ば',
	bi: 'び',
	bu: 'ぶ',
	be: 'べ',
	bo: 'ぼ',
	pa: 'ぱ',
	pi: 'ぴ',
	pu: 'ぷ',
	pe: 'ぺ',
	po: 'ぽ',

	// Combined characters
	kya: 'きゃ',
	kyu: 'きゅ',
	kyo: 'きょ',
	sha: 'しゃ',
	shu: 'しゅ',
	sho: 'しょ',
	cha: 'ちゃ',
	chu: 'ちゅ',
	cho: 'ちょ',
	nya: 'にゃ',
	nyu: 'にゅ',
	nyo: 'にょ',
	hya: 'ひゃ',
	hyu: 'ひゅ',
	hyo: 'ひょ',
	mya: 'みゃ',
	myu: 'みゅ',
	myo: 'みょ',
	rya: 'りゃ',
	ryu: 'りゅ',
	ryo: 'りょ',
	gya: 'ぎゃ',
	gyu: 'ぎゅ',
	gyo: 'ぎょ',
	ja: 'じゃ',
	ju: 'じゅ',
	jo: 'じょ',
	bya: 'びゃ',
	byu: 'びゅ',
	byo: 'びょ',
	pya: 'ぴゃ',
	pyu: 'ぴゅ',
	pyo: 'ぴょ',

	// Small characters
	la: 'ぁ',
	li: 'ぃ',
	lu: 'ぅ',
	le: 'ぇ',
	lo: 'ぉ',
	lya: 'ゃ',
	lyu: 'ゅ',
	lyo: 'ょ',
	ltu: 'っ',

	// Alternative spellings
	hu: 'ふ',
	si: 'し',
	ti: 'ち',
	tu: 'つ',
	zi: 'じ',
	wi: 'うぃ',
	we: 'うぇ',
	fa: 'ふぁ',
	fi: 'ふぃ',
	fe: 'ふぇ',
	fo: 'ふぉ',
	qa: 'くぁ',
	qi: 'くぃ',
	qu: 'くぅ',
	qe: 'くぇ',
	qo: 'くぉ',
	va: 'ゔぁ',
	vi: 'ゔぃ',
	vu: 'ゔ',
	ve: 'ゔぇ',
	vo: 'ゔぉ',

	// Double consonants for small tsu
	kk: 'っk',
	ss: 'っs',
	tt: 'っt',
	pp: 'っp',
	mm: 'っm',
	yy: 'っy',
	rr: 'っr',
	ww: 'っw',
	gg: 'っg',
	zz: 'っz',
	dd: 'っd',
	bb: 'っb',
	cc: 'っc',
	jj: 'っj',
	ff: 'っf',

	// Long vowels
	aa: 'あー',
	ii: 'いー',
	uu: 'うー',
	ee: 'えー',
	oo: 'おー'
};

/**
 * Converts romaji (Latin alphabet) to hiragana
 * @param romaji - The romaji string to convert
 * @returns Hiragana string
 */
export function romajiToJapanese(romaji: string): string {
	if (!romaji) return '';

	const lowerRomaji = romaji.toLowerCase();
	let result = '';
	let i = 0;

	while (i < lowerRomaji.length) {
		// Check for double consonants (small tsu)
		if (
			i < lowerRomaji.length - 1 &&
			lowerRomaji[i] === lowerRomaji[i + 1] &&
			'bcdfghjklmpqrstvwxyz'.includes(lowerRomaji[i])
		) {
			result += 'っ';
			i++;
			continue;
		}

		// Try 3 character sequences
		if (i < lowerRomaji.length - 2) {
			const threeChars = lowerRomaji.substring(i, i + 3);
			if (romajiToHiragana[threeChars]) {
				result += romajiToHiragana[threeChars];
				i += 3;
				continue;
			}
		}

		// Try 2 character sequences
		if (i < lowerRomaji.length - 1) {
			const twoChars = lowerRomaji.substring(i, i + 2);
			// Special handling for 'wo' particle
			if (twoChars === 'wo') {
				result += 'を';
				i += 2;
				continue;
			}
			if (romajiToHiragana[twoChars]) {
				result += romajiToHiragana[twoChars];
				i += 2;
				continue;
			}
		}

		// Try single character
		if (romajiToHiragana[lowerRomaji[i]]) {
			result += romajiToHiragana[lowerRomaji[i]];
			i++;
			continue;
		}

		// If no match is found, just add the character as is
		result += lowerRomaji[i];
		i++;
	}

	// Handle long vowels
	result = result
		.replace(/あー/g, 'ああ')
		.replace(/いー/g, 'いい')
		.replace(/うー/g, 'うう')
		.replace(/えー/g, 'ええ')
		.replace(/おー/g, 'おお');

	return result;
}

/**
 * Determines if a string contains only romaji characters
 * @param text - The string to check
 * @returns True if the string is only romaji
 */
export function isRomaji(text: string): boolean {
	// A simple check for romaji - contains only Latin alphabet and basic punctuation
	return /^[a-zA-Z0-9\s.,;:!?-]*$/.test(text);
}
