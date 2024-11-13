import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Add User heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Agregar Usuario/i);
  expect(headingElement).toBeInTheDocument();
});
