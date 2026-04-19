import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { LibraryProvider, useLibrary } from './LibraryContext';

jest.mock('../auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const { useAuth } = require('../auth/AuthContext');
const { supabase } = require('../../lib/supabase');

const createDeferred = () => {
  let resolve;
  let reject;

  const promise = new Promise((nextResolve, nextReject) => {
    resolve = nextResolve;
    reject = nextReject;
  });

  return { promise, resolve, reject };
};

const createQuery = (promise) => {
  const query = {
    select: jest.fn(() => query),
    eq: jest.fn(() => query),
    order: jest.fn(() => query),
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
    finally: promise.finally.bind(promise),
  };

  return query;
};

const LibraryProbe = () => {
  const { libraryLoading, watchlistItems, episodeEntriesByShow } = useLibrary();

  return (
    <div>
      <span>{libraryLoading ? 'loading' : 'idle'}</span>
      <span>{watchlistItems.length}</span>
      <span>{Object.keys(episodeEntriesByShow).length}</span>
    </div>
  );
};

describe('LibraryProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user: { id: 'user-123' },
      isSupabaseConfigured: true,
    });
  });

  it('deduplicates the initial library fetch when auth replays the same session', async () => {
    const watchlistDeferred = createDeferred();
    const episodesDeferred = createDeferred();
    const watchlistQuery = createQuery(watchlistDeferred.promise);
    const episodesQuery = createQuery(episodesDeferred.promise);

    supabase.from.mockImplementation((table) => {
      if (table === 'watchlist_items') {
        return watchlistQuery;
      }

      if (table === 'watched_episodes') {
        return episodesQuery;
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    const { rerender } = render(
      <LibraryProvider>
        <LibraryProbe />
      </LibraryProvider>
    );

    rerender(
      <LibraryProvider>
        <LibraryProbe />
      </LibraryProvider>
    );

    await waitFor(() => expect(supabase.from).toHaveBeenCalledTimes(2));

    watchlistDeferred.resolve({ data: [], error: null });
    episodesDeferred.resolve({ data: [], error: null });

    await waitFor(() => expect(screen.getByText('idle')).toBeInTheDocument());
    expect(supabase.from).toHaveBeenCalledTimes(2);
  });
});
