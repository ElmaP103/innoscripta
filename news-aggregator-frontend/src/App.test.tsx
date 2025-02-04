import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders news aggregator', () => {
  render(<App />);
  const titleElement = screen.getByText(/News Aggregator/i);
  expect(titleElement).toBeInTheDocument();
});
