# 動詞形 (Doushikei) - Japanese Verb Conjugation Practice

A Svelte and Tailwind CSS application for practicing Japanese verb conjugation. This app allows users to test their knowledge of different Japanese verb forms including tenses, polarity, and formality levels.

## Features

- Practice conjugating Japanese verbs in different forms:
  - Tenses: present/non-past, past, te-form, potential, passive, causative, imperative, volitional
  - Polarity: affirmative, negative
  - Formality: plain (casual), polite (です/ます)
- Immediate feedback on your answers
- Track your progress with a score system
- Learn the correct conjugations for both ichidan and godan verbs

## Getting Started

### Prerequisites

- Node.js (v16 or later recommended)
- pnpm package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## How to Use

1. Select the tense, polarity, and formality level you want to practice
2. A random Japanese verb will be displayed with its meaning
3. Type the correctly conjugated form in the input field
4. Click "Check" to verify your answer
5. If incorrect, you can click "Show Answer" to see the correct conjugation
6. Click "Next Verb" to continue practicing with a new verb

## Built With

- [SvelteKit](https://kit.svelte.dev/) - The web framework
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [TypeScript](https://www.typescriptlang.org/) - For type safety

## Future Enhancements

- Add more verbs to the database
- Support for compound conjugations (e.g., てしまう, ておく)
- Practice modes (quiz, timed challenges)
- User accounts to save progress
- Pronunciation audio for verbs and their conjugations
- Add explanations about conjugation rules

## License

This project is open source and available under the MIT License.

---

日本語動詞の活用を練習するためのアプリです。ぜひ使ってみてください！
