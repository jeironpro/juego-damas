import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App.jsx';

describe('App', () => {
  it('muestra la pantalla de inicio con las opciones de juego', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Damas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /jugar vs bot/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /2 jugadores/i })).toBeInTheDocument();
  });
});
