import { generateTopics, SIGN_IN_MESSAGE } from '../../app/_lib/generateTopics';
import { supabase } from '../../app/_lib/supabase';

jest.mock('../../app/_lib/supabase', () => ({
  supabase: { auth: { getSession: jest.fn() } },
}));

const mockGetSession = supabase.auth.getSession as jest.Mock;

function signedIn(token = 'real-token') {
  mockGetSession.mockResolvedValue({ data: { session: { access_token: token } } });
}

function signedOut() {
  mockGetSession.mockResolvedValue({ data: { session: null } });
}

function mockFetch(status: number, body: unknown) {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

const params = { count: 2, difficulty: 'easy' as const };

describe('generateTopics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('refuses to call the API when there is no real session', async () => {
    signedOut();
    const fetchMock = mockFetch(200, { questions: ['One?'] });

    await expect(generateTopics(params)).rejects.toThrow(SIGN_IN_MESSAGE);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('treats a failing session lookup as signed out', async () => {
    mockGetSession.mockRejectedValue(new Error('network down'));
    const fetchMock = mockFetch(200, { questions: ['One?'] });

    await expect(generateTopics(params)).rejects.toThrow(SIGN_IN_MESSAGE);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends the access token as a bearer header', async () => {
    signedIn('abc123');
    const fetchMock = mockFetch(200, { questions: ['One?', 'Two?'] });

    const questions = await generateTopics(params);

    expect(questions).toEqual(['One?', 'Two?']);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/generate-topics');
    expect(init.headers.Authorization).toBe('Bearer abc123');
    expect(JSON.parse(init.body)).toMatchObject({ count: 2, difficulty: 'easy' });
  });

  it('surfaces the server message on an error response', async () => {
    signedIn();
    mockFetch(401, { message: 'Please sign in to generate table topics questions.' });

    await expect(generateTopics(params)).rejects.toThrow('Please sign in to generate table topics questions.');
  });

  it('falls back to a status-code message when the body has none', async () => {
    signedIn();
    mockFetch(500, {});

    await expect(generateTopics(params)).rejects.toThrow('Generation failed (500).');
  });

  it('rejects an empty question list', async () => {
    signedIn();
    mockFetch(200, { questions: [] });

    await expect(generateTopics(params)).rejects.toThrow('No questions were generated. Please try again.');
  });
});
