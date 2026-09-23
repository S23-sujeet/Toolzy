import { randomInt } from './idTools';

/** The 100 most common English words - short and punctuation-free, ideal for typing practice. */
const WORD_BANK = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so',
  'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when',
  'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people',
  'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
  'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
  'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
  'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is',
];

function pickWord(): string {
  return WORD_BANK[randomInt(0, WORD_BANK.length - 1)];
}

/** Generates a space-separated passage of `count` random words for a typing test. */
export function generatePassage(count: number): string {
  return Array.from({ length: count }, pickWord).join(' ');
}

/** Standard typing-speed formula: one "word" = 5 characters, based on correctly typed characters. */
export function calculateWpm(correctChars: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  const minutes = elapsedMs / 60000;
  return Math.round(correctChars / 5 / minutes);
}

/** Percentage of typed characters that matched the target passage at the same position. */
export function calculateAccuracy(correctChars: number, totalTypedChars: number): number {
  if (totalTypedChars <= 0) return 100;
  return Math.round((correctChars / totalTypedChars) * 100);
}
