import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import Landing from './Landing';
import MoviesContext from '../context/movies/moviesContext';

jest.mock('./HeroSlider', () => () => <div>hero</div>);
jest.mock('./Filters', () => ({ headerControls }) => <div>{headerControls}</div>);
jest.mock('./Reveal', () => ({ children }) => <>{children}</>);
jest.mock('./Seo', () => () => null);
jest.mock('./Movie', () => ({
  Movie: ({ movie }) => <div>{movie.title}</div>,
}));

const movies = [
  { id: 1, title: 'Arrival', genre_ids: [1], release_date: '2016-11-11', vote_average: 7.9 },
  { id: 2, title: 'Interstellar', genre_ids: [2], release_date: '2014-11-07', vote_average: 8.6 },
];

const routerProps = {
  future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

const LocationProbe = () => {
  const location = useLocation();

  return <div data-testid="location-search">{location.search}</div>;
};

beforeEach(() => {
  window.scrollTo = jest.fn();
});

test('requests the next movie page from the active tab', () => {
  const getPlaying = jest.fn();
  const getTopRated = jest.fn();
  const getPopular = jest.fn();
  const getGenres = jest.fn();

  render(
    <MemoryRouter initialEntries={['/movies']} {...routerProps}>
      <MoviesContext.Provider
        value={{
          getPlaying,
          playing_loading: false,
          playing: [],
          getTopRated,
          top_rated_loading: false,
          top_rated: movies,
          top_rated_page: 1,
          top_rated_total_pages: 8,
          getPopular,
          popular_loading: false,
          popular: movies,
          popular_page: 1,
          popular_total_pages: 12,
          getGenres,
          genres: [],
        }}
      >
        <Landing />
        <LocationProbe />
      </MoviesContext.Provider>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole('button', { name: /go to page 2 for popular movies/i }));

  expect(getPopular).toHaveBeenCalledWith(2);
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  expect(screen.getByTestId('location-search')).toHaveTextContent('tab=popular');
  expect(screen.getByTestId('location-search')).toHaveTextContent('page=2');
});

test('syncs the active movie tab to the url and only fetches top rated when opened', () => {
  const getPlaying = jest.fn();
  const getTopRated = jest.fn();
  const getPopular = jest.fn();
  const getGenres = jest.fn();

  render(
    <MemoryRouter initialEntries={['/movies?tab=popular&page=3']} {...routerProps}>
      <MoviesContext.Provider
        value={{
          getPlaying,
          playing_loading: false,
          playing: [],
          getTopRated,
          top_rated_loading: false,
          top_rated: [],
          top_rated_page: 1,
          top_rated_total_pages: 8,
          getPopular,
          popular_loading: false,
          popular: movies,
          popular_page: 3,
          popular_total_pages: 12,
          getGenres,
          genres: [],
        }}
      >
        <Landing />
        <LocationProbe />
      </MoviesContext.Provider>
    </MemoryRouter>
  );

  expect(getPopular).not.toHaveBeenCalledWith(1);
  expect(getTopRated).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: /top rated/i }));

  expect(getTopRated).toHaveBeenCalledWith(1);
  expect(screen.getByTestId('location-search')).toHaveTextContent('tab=top_rated');
  expect(screen.getByTestId('location-search')).toHaveTextContent('page=1');
});

test('shows a 5-page movie pagination window and lets you jump to a page', () => {
  const getPlaying = jest.fn();
  const getTopRated = jest.fn();
  const getPopular = jest.fn();
  const getGenres = jest.fn();

  render(
    <MemoryRouter initialEntries={['/movies?tab=popular&page=6']} {...routerProps}>
      <MoviesContext.Provider
        value={{
          getPlaying,
          playing_loading: false,
          playing: [],
          getTopRated,
          top_rated_loading: false,
          top_rated: movies,
          top_rated_page: 6,
          top_rated_total_pages: 20,
          getPopular,
          popular_loading: false,
          popular: movies,
          popular_page: 6,
          popular_total_pages: 20,
          getGenres,
          genres: [],
        }}
      >
        <Landing />
      </MoviesContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getAllByRole('button', { name: /go to page \d+ for popular movies/i })).toHaveLength(5);
  expect(screen.getByRole('button', { name: /next page for popular movies/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /go to page 4 for popular movies/i }));

  expect(getPopular).toHaveBeenCalledWith(4);
});

test('refetches movie data when returning to a previously visited page', () => {
  const getPlaying = jest.fn();
  const getTopRated = jest.fn();
  const getPopular = jest.fn();
  const getGenres = jest.fn();

  const { rerender } = render(
    <MemoryRouter initialEntries={['/movies?tab=popular&page=2']} {...routerProps}>
      <MoviesContext.Provider
        value={{
          getPlaying,
          playing_loading: false,
          playing: [],
          getTopRated,
          top_rated_loading: false,
          top_rated: movies,
          top_rated_page: 1,
          top_rated_total_pages: 8,
          getPopular,
          popular_loading: false,
          popular: movies,
          popular_page: 2,
          popular_total_pages: 12,
          getGenres,
          genres: [],
        }}
      >
        <Landing />
      </MoviesContext.Provider>
    </MemoryRouter>
  );

  rerender(
    <MemoryRouter initialEntries={['/movies?tab=popular&page=2']} {...routerProps}>
      <MoviesContext.Provider
        value={{
          getPlaying,
          playing_loading: false,
          playing: [],
          getTopRated,
          top_rated_loading: false,
          top_rated: movies,
          top_rated_page: 1,
          top_rated_total_pages: 8,
          getPopular,
          popular_loading: false,
          popular: movies,
          popular_page: 3,
          popular_total_pages: 12,
          getGenres,
          genres: [],
        }}
      >
        <Landing />
      </MoviesContext.Provider>
    </MemoryRouter>
  );

  expect(getPopular).toHaveBeenCalledWith(2);
});

test('preserves unrelated movie query params when pagination state updates', () => {
  const getPlaying = jest.fn();
  const getTopRated = jest.fn();
  const getPopular = jest.fn();
  const getGenres = jest.fn();

  render(
    <MemoryRouter initialEntries={['/movies?tab=popular&page=3&view=grid']} {...routerProps}>
      <MoviesContext.Provider
        value={{
          getPlaying,
          playing_loading: false,
          playing: [],
          getTopRated,
          top_rated_loading: false,
          top_rated: movies,
          top_rated_page: 3,
          top_rated_total_pages: 8,
          getPopular,
          popular_loading: false,
          popular: movies,
          popular_page: 3,
          popular_total_pages: 12,
          getGenres,
          genres: [],
        }}
      >
        <Landing />
        <LocationProbe />
      </MoviesContext.Provider>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole('button', { name: /top rated/i }));

  expect(screen.getByTestId('location-search')).toHaveTextContent('tab=top_rated');
  expect(screen.getByTestId('location-search')).toHaveTextContent('page=1');
  expect(screen.getByTestId('location-search')).toHaveTextContent('view=grid');
});
