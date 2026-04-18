import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios', () => ({
  __esModule: true,
  get: jest.fn(() => Promise.resolve({ data: { results: [], genres: [] } })),
  default: {
    get: jest.fn(() => Promise.resolve({ data: { results: [], genres: [] } })),
  },
}));

test('renders the main movie experience', async () => {
  render(<App />);

  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));

  expect(screen.getAllByPlaceholderText(/search titles/i)[0]).toBeInTheDocument();
  expect(screen.getByText(/most popular/i)).toBeInTheDocument();
});
