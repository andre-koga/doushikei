/**
 * Extract Japanese verbs from JMdict and save to JSON
 *
 * This script:
 * 1. Downloads JMdict.gz from the official source
 * 2. Parses the XML and extracts verb entries
 * 3. Formats the data to match the app's requirements
 * 4. Saves the data to a JSON file
 */

import fs from 'fs';
import https from 'https';
import zlib from 'zlib';
import xml2js from 'xml2js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration options
const CONFIG = {
	outputPath: path.join(__dirname, '..', 'src', 'lib', 'verb-data.json'),
	maxVerbs: 500, // Limit total number of verbs
	minCommonFreq: 0, // Minimum frequency rank (0 = no filter)
	includeRareVerbs: false, // Whether to include rare or literary verbs
	useFrequencyList: true // Whether to use frequency list for sorting
};

// URLs for data sources
const URLS = {
	jmdict: 'https://www.edrdg.org/pub/Nihongo/JMdict_e.gz',
	// This is a simplified frequency list based on Japanese subtitles
	frequency:
		'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/ja/ja_full.txt'
};

// Download a Japanese word frequency list
async function downloadFrequencyList() {
	try {
		console.log('Downloading Japanese word frequency list...');

		return new Promise((resolve, reject) => {
			https.get(URLS.frequency, (response) => {
				if (response.statusCode !== 200) {
					reject(new Error(`Failed to download frequency list: ${response.statusCode}`));
					return;
				}

				const chunks = [];
				response.on('data', (chunk) => {
					chunks.push(chunk);
				});

				response.on('end', () => {
					const data = Buffer.concat(chunks).toString('utf8');
					resolve(data);
				});

				response.on('error', (err) => {
					reject(err);
				});
			});
		});
	} catch (error) {
		console.error('Error downloading frequency list:', error);
		return null;
	}
}

// Parse the frequency list into a Map of word -> frequency rank
function parseFrequencyList(data) {
	if (!data) return new Map();

	console.log('Parsing frequency list...');
	const frequencyMap = new Map();

	// Format is typically: word frequency
	const lines = data.split('\n');
	lines.forEach((line, index) => {
		if (!line.trim()) return;

		const parts = line.trim().split(' ');
		if (parts.length >= 2) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const [word, _frequency] = parts;
			// Store with rank (lower is more frequent)
			frequencyMap.set(word, index + 1);
		}
	});

	console.log(`Parsed ${frequencyMap.size} words from frequency list`);
	return frequencyMap;
}

// Download and process JMdict
async function downloadAndProcessJMdict() {
	try {
		// First, download frequency list if enabled
		let frequencyMap = new Map();
		if (CONFIG.useFrequencyList) {
			const frequencyData = await downloadFrequencyList();
			frequencyMap = parseFrequencyList(frequencyData);
		}

		console.log('Downloading JMdict.gz...');

		// Create a promise for the download
		const download = new Promise((resolve, reject) => {
			// Updated URL - using the correct official source
			https
				.get(URLS.jmdict, (response) => {
					if (response.statusCode !== 200) {
						reject(new Error(`Failed to download: ${response.statusCode}`));
						return;
					}

					const gunzip = zlib.createGunzip();
					const chunks = [];

					response.pipe(gunzip);

					gunzip.on('data', (chunk) => {
						chunks.push(chunk);
					});

					gunzip.on('end', () => {
						const xml = Buffer.concat(chunks).toString('utf8');
						resolve(xml);
					});

					gunzip.on('error', (err) => {
						reject(err);
					});
				})
				.on('error', (err) => {
					reject(err);
				});
		});

		const xmlData = await download;
		console.log('Download complete. Parsing XML...');

		// Parse XML with more lenient options
		const parser = new xml2js.Parser({
			explicitArray: false,
			strict: false, // Less strict parsing
			normalizeTags: false,
			normalize: true,
			// Handle character entity errors
			entityMap: {
				lt: '<',
				gt: '>',
				amp: '&',
				apos: "'",
				quot: '"'
			}
		});

		let result;
		try {
			result = await parser.parseStringPromise(xmlData);
			console.log('XML parsed successfully.');
		} catch (parseError) {
			console.error('Error parsing XML, attempting cleanup:', parseError.message);

			// Preprocess the XML to fix common issues
			let cleanedXml = xmlData
				// Replace problematic entity references
				.replace(/&(?!(lt|gt|amp|apos|quot);)/g, '&amp;')
				// Fix any incomplete CDATA sections
				.replace(/<!\[CDATA\[([^\]]*)$/g, '<![CDATA[$1]]>');

			console.log('Trying to parse cleaned XML...');
			result = await parser.parseStringPromise(cleanedXml);
			console.log('Cleaned XML parsed successfully.');
		}

		console.log('Extracting verbs...');

		// Determine the structure of the result
		console.log('Parsed XML root structure:', Object.keys(result));

		// Try to locate the entries regardless of exact structure (case-insensitive)
		let entries = [];

		// Check for entries in various possible locations with case-insensitive matching
		if (result.JMdict && result.JMdict.entry) {
			entries = result.JMdict.entry;
		} else if (result.JMDICT && result.JMDICT.ENTRY) {
			// Uppercase structure
			entries = result.JMDICT.ENTRY;
		} else if (result.jmdict && result.jmdict.entry) {
			// Lowercase structure
			entries = result.jmdict.entry;
		} else if (result.JMdict_e && result.JMdict_e.entry) {
			// Alternative structure with JMdict_e root
			entries = result.JMdict_e.entry;
		} else if (result.JMDICT_E && result.JMDICT_E.ENTRY) {
			// Uppercase alternative structure
			entries = result.JMDICT_E.ENTRY;
		} else if (result.jmdict_e && result.jmdict_e.entry) {
			// Lowercase alternative structure
			entries = result.jmdict_e.entry;
		} else if (result.entry) {
			// Simplified structure
			entries = result.entry;
		} else if (result.ENTRY) {
			// Uppercase simplified structure
			entries = result.ENTRY;
		} else {
			// Try to find an array of entries somewhere in the structure
			for (const key in result) {
				const keyLower = key.toLowerCase();

				// Check if this key might be the entries array directly
				if (Array.isArray(result[key]) && (keyLower === 'entry' || keyLower === 'entries')) {
					console.log(`Found entries array at root.${key} with ${result[key].length} items`);
					entries = result[key];
					break;
				}

				// Check if this is a container object
				if (typeof result[key] === 'object' && result[key] !== null) {
					console.log(`Checking container at root.${key}`);

					for (const subKey in result[key]) {
						const subKeyLower = subKey.toLowerCase();

						if (
							Array.isArray(result[key][subKey]) &&
							(subKeyLower === 'entry' || subKeyLower === 'entries')
						) {
							console.log(
								`Found entries array at root.${key}.${subKey} with ${result[key][subKey].length} items`
							);
							entries = result[key][subKey];
							break;
						}
					}

					if (entries.length > 0) break;
				}
			}
		}

		console.log(`Found ${entries.length} entries to process`);

		// Debug the structure of the first entry to understand the format
		if (entries.length > 0) {
			console.log('Sample entry structure:', Object.keys(entries[0]));
			const sampleEntry = entries[0];
			// Look for the sense/pos to understand structure
			for (const key of Object.keys(sampleEntry)) {
				console.log(`Entry.${key} type:`, typeof sampleEntry[key]);
				if (typeof sampleEntry[key] === 'object' && sampleEntry[key] !== null) {
					console.log(`Entry.${key} keys:`, Object.keys(sampleEntry[key]));

					// Check deeper into SENSE structure
					if (key === 'SENSE') {
						const pos = sampleEntry[key].POS;
						console.log('POS structure:', pos);
						if (Array.isArray(pos)) {
							console.log('POS array contents:', pos);
						}
					}
				}
			}
		}

		// Count how many entries we're recognizing as verbs for debugging
		let verbCount = 0;

		let verbs = [];

		// Keep track of verbs we've seen to avoid duplicates
		const seenVerbs = new Set();

		// Process each entry
		for (const entry of entries) {
			// Enhanced helper function to access fields with case-insensitive property names
			const getField = (obj, fieldName) => {
				if (!obj) return null;
				if (obj[fieldName]) return obj[fieldName];
				if (obj[fieldName.toUpperCase()]) return obj[fieldName.toUpperCase()];
				if (obj[fieldName.toLowerCase()]) return obj[fieldName.toLowerCase()];

				// Try alternative formats
				const alternatives = {
					k_ele: ['K_ELE', 'KELE', 'K_ENT', 'KENT'],
					r_ele: ['R_ELE', 'RELE', 'R_ENT', 'RENT'],
					keb: ['KEB', 'TEXT'],
					reb: ['REB', 'TEXT'],
					gloss: ['GLOSS'],
					pos: ['POS']
				};

				if (alternatives[fieldName]) {
					for (const alt of alternatives[fieldName]) {
						if (obj[alt]) return obj[alt];
					}
				}

				return null;
			};

			// Skip entries without needed elements
			const sense = getField(entry, 'sense');
			if (!sense) {
				// Try a more direct approach for uppercase keys
				if (!entry.SENSE) continue;
			}

			// Use either the found sense or directly access SENSE
			const sensesToProcess = sense || entry.SENSE;

			// Check if it's a verb
			let isVerb = false;
			let isIchidan = false;
			let isGodan = false;
			let isIrregular = false;
			let godanEnding = null;
			let isCommon = false;

			// Capture restrictive info
			let isRare = false;
			let isArchaic = false;

			const senses = Array.isArray(sensesToProcess) ? sensesToProcess : [sensesToProcess];

			// Check all senses for verb part-of-speech and other info
			for (const s of senses) {
				// Skip if no part of speech
				let pos = getField(s, 'pos');
				if (!pos) {
					// Try direct property access as backup
					pos = s.POS;
					if (!pos) continue;
				}

				const posArray = Array.isArray(pos) ? pos : [pos];

				// Check part of speech tags
				for (const p of posArray) {
					if (!p) continue;

					// Convert to string to handle different data types
					const pStr = p.toString();

					// Check if it's a verb
					if (pStr.toLowerCase().includes('v')) {
						isVerb = true;
						verbCount++; // Debug counter
						const pLower = pStr.toLowerCase();

						// Check verb type
						if (pLower.includes('v1')) {
							isIchidan = true;
						} else if (pLower.includes('vs-i') || pLower.includes('vk')) {
							isIrregular = true;
						} else if (pLower.includes('v5')) {
							isGodan = true;

							// Determine Godan ending
							if (pLower.includes('v5k')) godanEnding = 'ku';
							else if (pLower.includes('v5g')) godanEnding = 'gu';
							else if (pLower.includes('v5s')) godanEnding = 'su';
							else if (pLower.includes('v5t')) godanEnding = 'tsu';
							else if (pLower.includes('v5n')) godanEnding = 'nu';
							else if (pLower.includes('v5b')) godanEnding = 'bu';
							else if (pLower.includes('v5m')) godanEnding = 'mu';
							else if (pLower.includes('v5r')) godanEnding = 'ru';
							else if (pLower.includes('v5u')) godanEnding = 'u';
						}
					}
				}

				// Check for common tag
				let misc = getField(s, 'misc');
				if (!misc) {
					// Try direct property access
					misc = s.MISC;
				}

				if (misc) {
					const miscArray = Array.isArray(misc) ? misc : [misc];
					for (const m of miscArray) {
						if (!m) continue;
						const mLower = m.toString().toLowerCase();
						if (mLower === 'common') isCommon = true;
						if (mLower.includes('rare') || mLower.includes('obscure')) isRare = true;
						if (mLower.includes('arch') || mLower.includes('obsolete')) isArchaic = true;
					}
				}
			}

			// Skip if not a verb or rare/archaic (unless configured to include them)
			if (!isVerb || ((isRare || isArchaic) && !CONFIG.includeRareVerbs)) continue;

			// Get kanji and reading
			let kEle = (() => {
				const field = getField(entry, 'k_ele');
				// Try alternatives if needed
				if (!field && entry.K_ELE) return Array.isArray(entry.K_ELE) ? entry.K_ELE : [entry.K_ELE];
				return Array.isArray(field) ? field : field ? [field] : [];
			})();

			let rEle = (() => {
				const field = getField(entry, 'r_ele');
				// Try alternatives if needed
				if (!field && entry.R_ELE) return Array.isArray(entry.R_ELE) ? entry.R_ELE : [entry.R_ELE];
				return Array.isArray(field) ? field : field ? [field] : [];
			})();

			// Get primary kanji form, or use kana if no kanji
			let dictionary = null;
			if (kEle.length > 0) {
				dictionary = getField(kEle[0], 'keb');
				// Try direct access if needed
				if (!dictionary && kEle[0].KEB) dictionary = kEle[0].KEB;
			}

			// If no kanji, use kana reading
			if (!dictionary && rEle.length > 0) {
				dictionary = getField(rEle[0], 'reb');
				// Try direct access if needed
				if (!dictionary && rEle[0].REB) dictionary = rEle[0].REB;
			}

			// Skip if no dictionary form found
			if (!dictionary) continue;

			// Get kana reading
			let kana = null;
			if (rEle.length > 0) {
				kana = getField(rEle[0], 'reb');
				// Try direct access if needed
				if (!kana && rEle[0].REB) kana = rEle[0].REB;
			}

			if (!kana) continue; // Skip if no reading

			// Validation function for verbs - more sophisticated validation
			const isValidJapaneseVerb = (str, entry, senses) => {
				// First check: Must be marked as a verb in the data
				if (!isVerb) return false;

				// Check verb endings
				const validVerbEndings = ['う', 'く', 'ぐ', 'す', 'つ', 'ぬ', 'ぶ', 'む', 'る'];
				const lastChar = str.slice(-1);
				if (!validVerbEndings.includes(lastChar)) return false;

				// Count all part-of-speech tags to see if it's primarily a verb
				let verbPosCount = 0;
				let nonVerbPosCount = 0;

				// Check all senses for POS info
				for (const s of senses) {
					let pos = getField(s, 'pos') || s.POS;
					if (!pos) continue;

					const posArray = Array.isArray(pos) ? pos : [pos];

					for (const p of posArray) {
						if (!p) continue;
						const pStr = p.toString().toLowerCase();

						// Check if it's a verb POS
						if (pStr.includes('v')) {
							verbPosCount++;
						} else {
							nonVerbPosCount++;
						}
					}
				}

				// If more non-verb parts of speech than verb parts of speech,
				// it's probably not primarily a verb
				if (nonVerbPosCount > verbPosCount * 2) {
					return false;
				}

				// Check English glosses - verbs typically start with "to..."
				let verbDefinitionCount = 0;
				let nonVerbDefinitionCount = 0;

				for (const s of senses) {
					let gloss = getField(s, 'gloss') || s.GLOSS;
					if (!gloss) continue;

					const glossArray = Array.isArray(gloss) ? gloss : [gloss];

					for (const g of glossArray) {
						let glossText = '';

						if (typeof g === 'object') {
							glossText = getField(g, 'text') || g.TEXT || g.toString();
						} else {
							glossText = g.toString();
						}

						// Skip empty glosses
						if (!glossText) continue;

						// English verb definitions typically start with "to..."
						if (glossText.toLowerCase().startsWith('to ')) {
							verbDefinitionCount++;
						} else {
							nonVerbDefinitionCount++;
						}
					}
				}

				// If there are significantly more non-verb definitions than verb definitions,
				// it's likely not primarily a verb
				if (nonVerbDefinitionCount > verbDefinitionCount * 1.5) {
					return false;
				}

				// Special cases - known non-verbs that might slip through
				const knownNonVerbs = ['今日', '全部', '連絡', '約束', '科学', '通用'];
				if (knownNonVerbs.includes(dictionary)) {
					return false;
				}

				return true;
			};

			// Skip entries that don't pass the verb validation
			if (!isValidJapaneseVerb(kana, entry, senses)) {
				console.log(`Skipping non-verb entry: ${dictionary} (${kana})`);
				continue;
			}

			// Skip if we've already processed this verb (avoid duplicates)
			if (seenVerbs.has(dictionary)) continue;
			seenVerbs.add(dictionary);

			// Manual override for special verbs
			if (dictionary === 'する' || dictionary === '為る') {
				isIrregular = true;
				isIchidan = false;
				isGodan = false;
			} else if (dictionary === '来る' || dictionary === 'くる') {
				isIrregular = true;
				isIchidan = false;
				isGodan = false;
			}

			// Determine verb type priority: irregular > ichidan > godan
			let type = 'godan'; // Default
			if (isIrregular) {
				type = 'irregular';
			} else if (isIchidan) {
				type = 'ichidan';
			} else if (isGodan) {
				type = 'godan';
			}

			// Get English meaning
			let meaning = '';
			for (const s of senses) {
				let gloss = getField(s, 'gloss');
				// Try direct access if needed
				if (!gloss && s.GLOSS) gloss = s.GLOSS;

				if (gloss) {
					const glossArray = Array.isArray(gloss) ? gloss : [gloss];
					// Handle different gloss formats
					if (glossArray.length > 0) {
						if (typeof glossArray[0] === 'object') {
							meaning = glossArray
								.slice(0, 3)
								.map((g) => {
									const text = getField(g, 'text');
									return text || g.TEXT || g.toString();
								})
								.filter(Boolean)
								.join(', ');
						} else {
							meaning = glossArray.slice(0, 3).join(', ');
						}
					}
					break;
				}
			}

			// Create verb object
			const verb = {
				dictionary,
				kana,
				meaning,
				type
			};

			// Add ending for godan verbs
			if (type === 'godan' && godanEnding) {
				verb.ending = godanEnding;
			}

			// Determine priority based on frequency list and common tag
			let priority = 99999; // Default low priority (high number)

			if (CONFIG.useFrequencyList && frequencyMap && frequencyMap.size > 0) {
				// Check both dictionary form and kana reading in frequency list
				const dictFreq = frequencyMap.has(dictionary) ? frequencyMap.get(dictionary) : 99999;
				const kanaFreq = frequencyMap.has(kana) ? frequencyMap.get(kana) : 99999;

				// Use the better (lower) frequency rank if available
				priority = Math.min(dictFreq, kanaFreq);

				// Still boost common verbs to the top if they're not in frequency list
				if (isCommon && priority > 5000) {
					priority = 5000;
				}
			} else {
				// Original priority logic if frequency list is not used
				priority = isCommon ? 1 : 2;
			}

			// Add priority marker for sorting later
			verb._priority = priority;

			verbs.push(verb);
		}

		console.log(`Found ${verbCount} verb entries in total.`);
		console.log(`Extracted ${verbs.length} unique verbs.`);

		// Sort by priority (common first, or by frequency if available)
		verbs.sort((a, b) => a._priority - b._priority);

		// Add additional logging for frequency-sorted verbs
		if (CONFIG.useFrequencyList && verbs.length > 0) {
			console.log('Top 5 frequency-ranked verbs:');
			verbs.slice(0, 5).forEach((v, i) => {
				console.log(`${i + 1}. ${v.dictionary} (${v.kana}) - rank: ${v._priority}`);
			});
		}

		// Remove temporary priority field and limit to max number
		verbs = verbs.slice(0, CONFIG.maxVerbs).map((v) => {
			// Using _ prefix to indicate intentionally unused variable
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { _priority, ...cleanVerb } = v;
			return cleanVerb;
		});

		// Save to JSON file
		fs.writeFileSync(CONFIG.outputPath, JSON.stringify(verbs, null, 2));
		console.log(`Saved ${verbs.length} verbs to ${CONFIG.outputPath}`);
		return true;
	} catch (error) {
		console.error('Error with XML approach:', error);
		console.log('Falling back to pre-processed JSON data...');
		return await downloadPreprocessedJSONData();
	}
}

// Fallback function to download pre-processed JSON data
async function downloadPreprocessedJSONData() {
	try {
		console.log('Downloading pre-processed JSON data...');

		// First, download frequency list if enabled
		let frequencyMap = new Map();
		if (CONFIG.useFrequencyList) {
			const frequencyData = await downloadFrequencyList();
			frequencyMap = parseFrequencyList(frequencyData);
		}

		// Download from a reliable source with pre-processed Japanese verb data
		const jsonUrl =
			'https://raw.githubusercontent.com/scriptin/jmdict-simplified/master/JMdict.json';

		const download = new Promise((resolve, reject) => {
			https
				.get(jsonUrl, (response) => {
					if (response.statusCode !== 200) {
						reject(new Error(`Failed to download JSON: ${response.statusCode}`));
						return;
					}

					const chunks = [];
					response.on('data', (chunk) => {
						chunks.push(chunk);
					});

					response.on('end', () => {
						const data = Buffer.concat(chunks).toString('utf8');
						resolve(data);
					});

					response.on('error', (err) => {
						reject(err);
					});
				})
				.on('error', (err) => {
					reject(err);
				});
		});

		const data = await download;
		console.log('JSON data downloaded successfully.');

		const parsed = JSON.parse(data);
		console.log(`Parsed JSON with ${parsed.length} entries`);

		// Process the JSON data
		let verbs = [];
		const seenVerbs = new Set();

		// Helper function to extract field values, similar to the one in the main processing function
		const getField = (obj, fieldName) => {
			if (!obj) return null;
			if (obj[fieldName]) return obj[fieldName];
			if (obj[fieldName.toUpperCase()]) return obj[fieldName.toUpperCase()];
			if (obj[fieldName.toLowerCase()]) return obj[fieldName.toLowerCase()];
			return null;
		};

		// Process each entry
		for (const entry of parsed) {
			// Skip entries without needed elements
			if (!entry.senses || entry.senses.length === 0) continue;

			// Check if it's a verb
			let isVerb = false;
			let isIchidan = false;
			let isGodan = false;
			let isIrregular = false;
			let godanEnding = null;
			let isCommon = false;
			let isRare = false;
			let isArchaic = false;

			// Check all senses for verb part-of-speech and other info
			for (const sense of entry.senses) {
				if (!sense.partOfSpeech || sense.partOfSpeech.length === 0) continue;

				// Check if it's a verb and determine its type
				for (const pos of sense.partOfSpeech) {
					if (pos.startsWith('v')) {
						isVerb = true;

						if (pos === 'v1') isIchidan = true;
						else if (pos === 'vs-i' || pos === 'vk') isIrregular = true;
						else if (pos.startsWith('v5')) {
							isGodan = true;
							if (pos === 'v5k') godanEnding = 'ku';
							else if (pos === 'v5g') godanEnding = 'gu';
							else if (pos === 'v5s') godanEnding = 'su';
							else if (pos === 'v5t') godanEnding = 'tsu';
							else if (pos === 'v5n') godanEnding = 'nu';
							else if (pos === 'v5b') godanEnding = 'bu';
							else if (pos === 'v5m') godanEnding = 'mu';
							else if (pos === 'v5r') godanEnding = 'ru';
							else if (pos === 'v5u') godanEnding = 'u';
						}
					}
				}

				// Check for commonness, rarity
				if (sense.misc) {
					for (const misc of sense.misc) {
						if (misc === 'common') isCommon = true;
						if (misc === 'rare' || misc === 'obscure') isRare = true;
						if (misc === 'arch' || misc === 'obsolete') isArchaic = true;
					}
				}
			}

			// Skip if not a verb or rare/archaic (unless configured to include them)
			if (!isVerb || ((isRare || isArchaic) && !CONFIG.includeRareVerbs)) continue;

			// Get kanji form (if available)
			let dictionary = null;
			let kana = null;

			if (entry.kanji && entry.kanji.length > 0) {
				dictionary = entry.kanji[0].text;
			}

			if (entry.kana && entry.kana.length > 0) {
				kana = entry.kana[0].text;
				if (!dictionary) dictionary = kana;
			}

			if (!dictionary || !kana) continue;

			// Validation function for verbs - more sophisticated validation
			const isValidJapaneseVerb = (str, entry, senses) => {
				// First check: Must be marked as a verb in the data
				if (!isVerb) return false;

				// Check verb endings
				const validVerbEndings = ['う', 'く', 'ぐ', 'す', 'つ', 'ぬ', 'ぶ', 'む', 'る'];
				const lastChar = str.slice(-1);
				if (!validVerbEndings.includes(lastChar)) return false;

				// Count all part-of-speech tags to see if it's primarily a verb
				let verbPosCount = 0;
				let nonVerbPosCount = 0;

				// Check all senses for POS info
				for (const s of senses) {
					let pos = getField(s, 'pos') || s.POS;
					if (!pos) continue;

					const posArray = Array.isArray(pos) ? pos : [pos];

					for (const p of posArray) {
						if (!p) continue;
						const pStr = p.toString().toLowerCase();

						// Check if it's a verb POS
						if (pStr.includes('v')) {
							verbPosCount++;
						} else {
							nonVerbPosCount++;
						}
					}
				}

				// If more non-verb parts of speech than verb parts of speech,
				// it's probably not primarily a verb
				if (nonVerbPosCount > verbPosCount * 2) {
					return false;
				}

				// Check English glosses - verbs typically start with "to..."
				let verbDefinitionCount = 0;
				let nonVerbDefinitionCount = 0;

				for (const s of senses) {
					let gloss = getField(s, 'gloss') || s.GLOSS;
					if (!gloss) continue;

					const glossArray = Array.isArray(gloss) ? gloss : [gloss];

					for (const g of glossArray) {
						let glossText = '';

						if (typeof g === 'object') {
							glossText = getField(g, 'text') || g.TEXT || g.toString();
						} else {
							glossText = g.toString();
						}

						// Skip empty glosses
						if (!glossText) continue;

						// English verb definitions typically start with "to..."
						if (glossText.toLowerCase().startsWith('to ')) {
							verbDefinitionCount++;
						} else {
							nonVerbDefinitionCount++;
						}
					}
				}

				// If there are significantly more non-verb definitions than verb definitions,
				// it's likely not primarily a verb
				if (nonVerbDefinitionCount > verbDefinitionCount * 1.5) {
					return false;
				}

				// Special cases - known non-verbs that might slip through
				const knownNonVerbs = ['今日', '全部', '連絡', '約束', '科学', '通用'];
				if (knownNonVerbs.includes(dictionary)) {
					return false;
				}

				return true;
			};

			// Skip entries that don't pass the verb validation
			if (!isValidJapaneseVerb(kana, entry, entry.senses)) {
				continue;
			}

			// Skip duplicates

			// Skip if we've already processed this verb (avoid duplicates)
			if (seenVerbs.has(dictionary)) continue;
			seenVerbs.add(dictionary);

			// Special case handling for irregular verbs
			if (dictionary === 'する' || dictionary === '為る') {
				isIrregular = true;
				isIchidan = false;
				isGodan = false;
			} else if (dictionary === '来る' || dictionary === 'くる') {
				isIrregular = true;
				isIchidan = false;
				isGodan = false;
			}

			// Determine verb type
			let type = 'godan'; // Default
			if (isIrregular) type = 'irregular';
			else if (isIchidan) type = 'ichidan';
			else if (isGodan) type = 'godan';

			// Get English meaning
			let meaning = '';
			if (entry.senses[0].gloss && entry.senses[0].gloss.length > 0) {
				meaning = entry.senses[0].gloss
					.slice(0, 3)
					.map((g) => g.text)
					.join(', ');
			}

			// Create verb object
			const verb = {
				dictionary,
				kana,
				meaning,
				type
			};

			// Add ending for godan verbs
			if (type === 'godan' && godanEnding) {
				verb.ending = godanEnding;
			}

			// Determine priority based on frequency list and common tag
			let priority = 99999; // Default low priority (high number)

			if (CONFIG.useFrequencyList && frequencyMap && frequencyMap.size > 0) {
				// Check both dictionary form and kana reading in frequency list
				const dictFreq = frequencyMap.has(dictionary) ? frequencyMap.get(dictionary) : 99999;
				const kanaFreq = frequencyMap.has(kana) ? frequencyMap.get(kana) : 99999;

				// Use the better (lower) frequency rank if available
				priority = Math.min(dictFreq, kanaFreq);

				// Still boost common verbs to the top if they're not in frequency list
				if (isCommon && priority > 5000) {
					priority = 5000;
				}
			} else {
				// Original priority logic if frequency list is not used
				priority = isCommon ? 1 : 2;
			}

			// Add priority marker for sorting later
			verb._priority = priority;

			verbs.push(verb);
		}

		console.log(`Extracted ${verbs.length} verbs from JSON.`);

		// Sort by priority and limit to max number
		verbs.sort((a, b) => a._priority - b._priority);
		verbs = verbs.slice(0, CONFIG.maxVerbs).map((v) => {
			// Using _ prefix to indicate intentionally unused variable
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { _priority, ...cleanVerb } = v;
			return cleanVerb;
		});

		// Save to JSON file
		fs.writeFileSync(CONFIG.outputPath, JSON.stringify(verbs, null, 2));
		console.log(`Saved ${verbs.length} verbs to ${CONFIG.outputPath}`);
		return true;
	} catch (error) {
		console.error('Error with JSON fallback:', error);
		return false;
	}
}

// Run the extractor
downloadAndProcessJMdict();
