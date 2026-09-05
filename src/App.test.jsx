import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App.jsx';

describe('App', () => {
  it('renderiza el título de la aplicación', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Damas' })).toBeInTheDocument();
  });
});
