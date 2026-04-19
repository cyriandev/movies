import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Result from './Result';

describe('Result', () => {
  test('shows the release date for movie search results', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Result
          item={{
            id: 10,
            media_type: 'movie',
            title: 'Arrival',
            release_date: '2016-11-11',
            vote_average: 7.6,
            poster_path: null,
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('11 Nov 2016')).toBeInTheDocument();
    expect(screen.queryByText(/open profile/i)).not.toBeInTheDocument();
  });

  test('shows the first air date for tv search results', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Result
          item={{
            id: 20,
            media_type: 'tv',
            name: 'Dark',
            first_air_date: '2017-12-01',
            vote_average: 8.4,
            poster_path: null,
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('01 Dec 2017')).toBeInTheDocument();
    expect(screen.getByText('Series')).toBeInTheDocument();
  });
});
