import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PLAYER_1 } from '@/features/game/constants.js';
import { createGame, applyMove, undoMove, getLegalMovesForGame } from '@/features/game/game.js';
import GameScreen from './GameScreen.jsx';

describe('GameScreen — modo local', () => {
  it('permite mover una ficha y alternar el turno', async () => {
    const user = userEvent.setup();
    const game = createGame();
    const onMove = vi.fn((move) => move);
    render(<GameScreen game={game} onMove={onMove} onUndo={() => {}} />);
    await user.click(screen.getByRole('button', { name: 'Fila 6 columna 1' }));
    await user.click(screen.getByRole('button', { name: 'Fila 5 columna 2' }));
    expect(onMove).toHaveBeenCalledTimes(1);
  });

  it('deshabilita el botón de deshacer tras usarlo (una vez por partida)', async () => {
    const user = userEvent.setup();
    const game = applyMove(createGame(), getLegalMovesForGame(createGame())[0]);
    const onUndo = vi.fn();
    const { rerender } = render(<GameScreen game={game} onMove={() => {}} onUndo={onUndo} />);
    const undoButton = screen.getByRole('button', { name: /deshacer/i });
    expect(undoButton).not.toBeDisabled();
    await user.click(undoButton);
    expect(onUndo).toHaveBeenCalledTimes(1);
    // al deshacer, el motor marca undoUsed y el botón queda deshabilitado
    rerender(<GameScreen game={undoMove(game)} onMove={() => {}} onUndo={onUndo} />);
    expect(screen.getByRole('button', { name: /deshacer/i })).toBeDisabled();
  });

  it('muestra el mensaje de fin de partida con el ganador', () => {
    const game = { ...createGame(), over: true, winner: PLAYER_1 };
    render(<GameScreen game={game} onMove={() => {}} onUndo={() => {}} />);
    expect(screen.getByRole('status')).toHaveTextContent(/Jugador 1 gana/i);
  });
});
