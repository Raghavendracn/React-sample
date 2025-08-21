import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders React MUI TypeScript App', () => {
  render(<App />);
  const linkElement = screen.getByText(/Dashboard/i);
  expect(linkElement).toBeInTheDocument();
});
