import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomeScreen from './HomeScreen.jsx';

describe('HomeScreen', () => {
  it('lets the player pick the bot mode, its difficulty and start', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<HomeScreen onStart={onStart} />);
    // sin modo seleccionado, el botón Jugar está deshabilitado
    expect(screen.getByRole('button', { name: 'Jugar' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /jugar vs bot/i }));
    await user.click(screen.getByRole('button', { name: 'Difícil' }));
    await user.click(screen.getByRole('button', { name: 'Jugar' }));
    expect(onStart).toHaveBeenCalledWith('bot', 'dificil');
  });

  it('lets the player pick the two-player mode', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<HomeScreen onStart={onStart} />);
    await user.click(screen.getByRole('button', { name: /2 jugadores/i }));
    await user.click(screen.getByRole('button', { name: 'Jugar' }));
    expect(onStart).toHaveBeenCalledWith('local', 'dificil');
  });

  it('shows the difficulty selector only in bot mode', async () => {
    const user = userEvent.setup();
    render(<HomeScreen onStart={() => {}} />);
    expect(screen.queryByRole('group', { name: 'Dificultad del bot' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /jugar vs bot/i }));
    expect(screen.getByRole('group', { name: 'Dificultad del bot' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fácil' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Medio' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Difícil' })).toBeInTheDocument();
  });
});
