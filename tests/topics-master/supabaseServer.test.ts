/**
 * @jest-environment node
 */
import { createClient } from '@supabase/supabase-js';
import { getRequestUser } from '../../app/_lib/supabaseServer';

jest.mock('@supabase/supabase-js', () => ({ createClient: jest.fn() }));

const mockCreateClient = createClient as jest.Mock;
const ORIGINAL_ENV = process.env;

function mockGetUser(result: unknown) {
  const getUser = jest.fn().mockResolvedValue(result);
  mockCreateClient.mockReturnValue({ auth: { getUser } });
  return getUser;
}

function requestWithAuth(header?: string) {
  return new Request('http://localhost/generate-topics', {
    method: 'POST',
    headers: header ? { Authorization: header } : {},
  });
}

describe('getRequestUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
    };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('reports unconfigured when Supabase env vars are missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    const result = await getRequestUser(requestWithAuth('Bearer token'));

    expect(result).toEqual({ user: null, failure: 'unconfigured' });
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  it('rejects a request with no Authorization header', async () => {
    const result = await getRequestUser(requestWithAuth());
    expect(result).toEqual({ user: null, failure: 'missing-token' });
  });

  it('rejects a malformed Authorization header', async () => {
    expect(await getRequestUser(requestWithAuth('token-without-scheme'))).toEqual({
      user: null,
      failure: 'missing-token',
    });
    expect(await getRequestUser(requestWithAuth('Bearer '))).toEqual({
      user: null,
      failure: 'missing-token',
    });
  });

  it('rejects a token Supabase does not recognise', async () => {
    mockGetUser({ data: { user: null }, error: { message: 'invalid JWT' } });

    const result = await getRequestUser(requestWithAuth('Bearer mock-token'));

    expect(result).toEqual({ user: null, failure: 'invalid-token' });
  });

  it('rejects when the Supabase call throws', async () => {
    const getUser = jest.fn().mockRejectedValue(new Error('network'));
    mockCreateClient.mockReturnValue({ auth: { getUser } });

    const result = await getRequestUser(requestWithAuth('Bearer some-token'));

    expect(result).toEqual({ user: null, failure: 'invalid-token' });
  });

  it('returns the user for a valid token', async () => {
    const user = { id: 'user-1', email: 'member@club.org' };
    const getUser = mockGetUser({ data: { user }, error: null });

    const result = await getRequestUser(requestWithAuth('Bearer valid-token'));

    expect(result).toEqual({ user, failure: null });
    expect(getUser).toHaveBeenCalledWith('valid-token');
  });

  it('accepts a lowercase bearer scheme', async () => {
    const user = { id: 'user-1' };
    mockGetUser({ data: { user }, error: null });

    const result = await getRequestUser(requestWithAuth('bearer valid-token'));

    expect(result.user).toEqual(user);
  });
});
