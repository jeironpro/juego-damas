import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

describe('App', () => {
  it('muestra la pantalla de inicio con las opciones de juego', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Damas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /jugar vs bot/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /2 jugadores/i })).toBeInTheDocument();
  });

  it('vuelve a la pantalla de inicio desde una partida', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /2 jugadores/i }));
    await user.click(screen.getByRole('button', { name: 'Jugar' }));
    // en partida: el marcador está visible y no hay opciones de modo
    expect(screen.getByRole('region', { name: 'Marcador de la partida' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /menú/i }));
    expect(screen.getByRole('heading', { name: 'Damas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /2 jugadores/i })).toBeInTheDocument();
  });
});
