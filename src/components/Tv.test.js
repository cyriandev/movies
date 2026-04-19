import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import Tv from './Tv';
import TvContext from '../context/tv/tvContext';

jest.mock('./HeroSlider', () => () => <div>hero</div>);
jest.mock('./Filters', () => ({ headerControls }) => <div>{headerControls}</div>);
jest.mock('./Reveal', () => ({ children }) => <>{children}</>);
jest.mock('./Seo', () => () => null);
jest.mock('./TvItem', () => ({ tv }) => <div>{tv.name}</div>);

const shows = [
  { id: 1, name: 'Dark', genre_ids: [1], first_air_date: '2017-12-01', vote_average: 8.7 },
  { id: 2, name: 'Severance', genre_ids: [2], first_air_date: '2022-02-18', vote_average: 8.3 },
];

const routerProps = {
  future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

const LocationProbe = () => {
  const location = useLocation();

  return <div data-testid="location-search">{location.search}</div>;
};

test('requests the next tv page from the active tab', () => {
  const getOnAir = jest.fn();
  const getTopRated = jest.fn();
  const getPopular = jest.fn();
  const getTvGenres = jest.fn();

  render(
    <MemoryRouter initialEntries={['/tv']} {...routerProps}>
      <TvContext.Provider
        value={{
          getOnAir,
          onAir_loading: false,
          onAir: [],
          getTopRated,
          top_rated_loading: false,
          top_rated: shows,
          top_rated_page: 1,
          top_rated_total_pages: 7,
          getPopular,
          popular_loading: false,
          popular: shows,
          popular_page: 1,
          popular_total_pages: 11,
          getTvGenres,
          tvGenres: [],
        }}
      >
        <Tv />
        <LocationProbe />
      </TvContext.Provider>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole('button', { name: /next page for popular series/i }));

  expect(getPopular).toHaveBeenCalledWith(2);
  expect(screen.getByTestId('location-search')).toHaveTextContent('tab=popular');
  expect(screen.getByTestId('location-search')).toHaveTextContent('page=2');
});

test('syncs the active tv tab to the url and only fetches top rated when opened', () => {
  const getOnAir = jest.fn();
  const getTopRated = jest.fn();
  const getPopular = jest.fn();
  const getTvGenres = jest.fn();

  render(
    <MemoryRouter initialEntries={['/tv?tab=popular&page=3']} {...routerProps}>
      <TvContext.Provider
        value={{
          getOnAir,
          onAir_loading: false,
          onAir: [],
          getTopRated,
          top_rated_loading: false,
          top_rated: [],
          top_rated_page: 1,
          top_rated_total_pages: 7,
          getPopular,
          popular_loading: false,
          popular: shows,
          popular_page: 3,
          popular_total_pages: 11,
          getTvGenres,
          tvGenres: [],
        }}
      >
        <Tv />
        <LocationProbe />
      </TvContext.Provider>
    </MemoryRouter>
  );

  expect(getPopular).not.toHaveBeenCalledWith(1);
  expect(getTopRated).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: /top rated/i }));

  expect(getTopRated).toHaveBeenCalledWith(1);
  expect(screen.getByTestId('location-search')).toHaveTextContent('tab=top_rated');
  expect(screen.getByTestId('location-search')).toHaveTextContent('page=1');
});

test('shows a 5-page tv pagination window and lets you jump to a page', () => {
  const getOnAir = jest.fn();
  const getTopRated = jest.fn();
  const getPopular = jest.fn();
  const getTvGenres = jest.fn();

  render(
    <MemoryRouter initialEntries={['/tv?tab=popular&page=6']} {...routerProps}>
      <TvContext.Provider
        value={{
          getOnAir,
          onAir_loading: false,
          onAir: [],
          getTopRated,
          top_rated_loading: false,
          top_rated: shows,
          top_rated_page: 6,
          top_rated_total_pages: 20,
          getPopular,
          popular_loading: false,
          popular: shows,
          popular_page: 6,
          popular_total_pages: 20,
          getTvGenres,
          tvGenres: [],
        }}
      >
        <Tv />
      </TvContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getAllByRole('button', { name: /go to page \d+ for popular series/i })).toHaveLength(5);
  expect(screen.getByRole('button', { name: /next page for popular series/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /go to page 4 for popular series/i }));

  expect(getPopular).toHaveBeenCalledWith(4);
});
