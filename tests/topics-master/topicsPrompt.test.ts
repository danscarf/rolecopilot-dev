import {
  buildPrompt,
  extractQuestions,
  normalizeInput,
  MAX_COUNT,
  DEFAULT_COUNT,
  MAX_AVOID_ITEMS,
} from '../../app/_lib/topicsPrompt';

describe('normalizeInput', () => {
  it('defaults count and difficulty when absent', () => {
    const input = normalizeInput({});
    expect(input.count).toBe(DEFAULT_COUNT);
    expect(input.difficulty).toBe('easy');
    expect(input.theme).toBe('');
    expect(input.wordOfTheDay).toBe('');
    expect(input.avoid).toEqual([]);
  });

  it('clamps count to the 1-10 range', () => {
    expect(normalizeInput({ count: 0 }).count).toBe(1);
    expect(normalizeInput({ count: 99 }).count).toBe(MAX_COUNT);
    expect(normalizeInput({ count: 3.7 }).count).toBe(3);
  });

  it('falls back to the default count for non-numeric input', () => {
    expect(normalizeInput({ count: 'lots' as unknown as number }).count).toBe(DEFAULT_COUNT);
  });

  it('only accepts hard as a non-default difficulty', () => {
    expect(normalizeInput({ difficulty: 'hard' }).difficulty).toBe('hard');
    expect(normalizeInput({ difficulty: 'impossible' as unknown as 'hard' }).difficulty).toBe('easy');
  });

  it('trims and truncates theme and word of the day', () => {
    const input = normalizeInput({ theme: `  ${'t'.repeat(300)}  `, wordOfTheDay: '  serendipity  ' });
    expect(input.theme).toHaveLength(200);
    expect(input.wordOfTheDay).toBe('serendipity');
  });

  it('caps the avoid list and drops non-strings', () => {
    const avoid = [...Array(80).keys()].map(i => `Question ${i}?`);
    const input = normalizeInput({ avoid: [...avoid, 42 as unknown as string] });
    expect(input.avoid).toHaveLength(MAX_AVOID_ITEMS);
  });
});

describe('buildPrompt', () => {
  it('asks for the requested number of questions', () => {
    const prompt = buildPrompt({ count: 3, difficulty: 'easy' });
    expect(prompt).toContain('Generate exactly 3 table topics questions');
  });

  it('uses singular phrasing for a single question', () => {
    const prompt = buildPrompt({ count: 1, difficulty: 'easy' });
    expect(prompt).toContain('Generate exactly 1 table topics question.');
  });

  it('includes theme and word of the day when provided', () => {
    const prompt = buildPrompt({ count: 5, difficulty: 'easy', theme: 'New Beginnings', wordOfTheDay: 'serendipity' });
    expect(prompt).toContain('Meeting theme: "New Beginnings"');
    expect(prompt).toContain('Word of the Day: "serendipity"');
  });

  it('falls back to general-purpose questions with no theme or word', () => {
    const prompt = buildPrompt({ count: 5, difficulty: 'easy' });
    expect(prompt).toContain('No theme or word of the day was provided');
  });

  it('applies difficulty-specific guidance', () => {
    expect(buildPrompt({ count: 1, difficulty: 'easy' })).toContain('EASY questions');
    expect(buildPrompt({ count: 1, difficulty: 'hard' })).toContain('HARD questions');
  });

  it('lists questions to avoid so regeneration does not repeat them', () => {
    const prompt = buildPrompt({ count: 1, difficulty: 'easy', avoid: ['Old question?'] });
    expect(prompt).toContain('ALREADY in use');
    expect(prompt).toContain('- Old question?');
  });

  it('omits the avoid block when there is nothing to avoid', () => {
    expect(buildPrompt({ count: 1, difficulty: 'easy', avoid: [] })).not.toContain('ALREADY in use');
  });
});

describe('extractQuestions', () => {
  it('parses a plain JSON array', () => {
    expect(extractQuestions('["One?", "Two?"]', 5)).toEqual(['One?', 'Two?']);
  });

  it('parses an array wrapped in markdown fences and commentary', () => {
    const text = 'Sure! Here you go:\n```json\n["One?", "Two?"]\n```\nHope that helps.';
    expect(extractQuestions(text, 5)).toEqual(['One?', 'Two?']);
  });

  it('trims entries and drops blanks and non-strings', () => {
    expect(extractQuestions('["  One?  ", "", 7, "Two?"]', 5)).toEqual(['One?', 'Two?']);
  });

  it('truncates to the requested count', () => {
    expect(extractQuestions('["a", "b", "c"]', 2)).toEqual(['a', 'b']);
  });

  it('returns null when there is no array', () => {
    expect(extractQuestions('I could not do that.', 5)).toBeNull();
  });

  it('returns null on malformed JSON', () => {
    expect(extractQuestions('["unterminated, "oops"]', 5)).toBeNull();
  });

  it('returns null when the array has no usable strings', () => {
    expect(extractQuestions('[]', 5)).toBeNull();
    expect(extractQuestions('["   "]', 5)).toBeNull();
  });
});
