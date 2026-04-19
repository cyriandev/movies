import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Movie } from './Movie';
import TvItem from './TvItem';

const routerProps = {
  future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

describe('poster badges', () => {
  test('keeps the movie badge on movie cards', () => {
    render(
      <MemoryRouter {...routerProps}>
        <Movie
          movie={{
            id: 1,
            title: 'Interstellar',
            release_date: '2014-11-07',
            vote_average: 8.4,
            poster_path: '/poster.jpg',
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Film')).toHaveClass('bg-black/78', 'backdrop-blur-md', 'ring-1', 'shadow-[0_2px_8px_rgba(0,0,0,0.16)]');
    expect(screen.getByText('8.4')).toHaveClass('shadow-[0_2px_8px_rgba(0,0,0,0.16)]');
  });

  test('keeps the tv badge on series cards', () => {
    render(
      <MemoryRouter {...routerProps}>
        <TvItem
          tv={{
            id: 2,
            name: 'Severance',
            first_air_date: '2022-02-18',
            vote_average: 8.3,
            poster_path: '/poster.jpg',
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Series')).toHaveClass('bg-black/78', 'backdrop-blur-md', 'ring-1', 'shadow-[0_2px_8px_rgba(0,0,0,0.16)]');
    expect(screen.getByText('8.3')).toHaveClass('shadow-[0_2px_8px_rgba(0,0,0,0.16)]');
  });
});
