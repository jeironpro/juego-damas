import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PLAYER_1, PLAYER_2 } from '@/features/game/constants.js';
import { createGame, applyMove, undoMove } from '@/features/game/game.js';
import { getLegalMoves } from '@/features/game/moves.js';
import GameScreen from './GameScreen.jsx';

// Partida tras la primera jugada del jugador 1
function gameAfterFirstMove() {
  const game = createGame();
  return applyMove(game, getLegalMoves(game.board, game.turn)[0]);
}

describe('GameScreen — local mode', () => {
  it('lets a player move a piece and alternates the turn', async () => {
    const user = userEvent.setup();
    const game = createGame();
    const onMove = vi.fn((move) => move);
    render(<GameScreen game={game} onMove={onMove} onUndo={() => {}} />);
    await user.click(screen.getByRole('button', { name: 'Fila 6 columna 1' }));
    await user.click(screen.getByRole('button', { name: 'Fila 5 columna 2' }));
    expect(onMove).toHaveBeenCalledTimes(1);
  });

  it('disables the undo button after using it (once per game)', async () => {
    const user = userEvent.setup();
    const game = gameAfterFirstMove();
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

  it('shows the game over modal with the winner', () => {
    const game = { ...createGame(), over: true, winner: PLAYER_1 };
    render(
      <GameScreen
        game={game}
        onMove={() => {}}
        onUndo={() => {}}
        onRestart={() => {}}
        onMenu={() => {}}
      />,
    );
    expect(screen.getByRole('dialog')).toHaveTextContent(/Jugador 1 gana/i);
  });

  it('announces the player victory in bot mode', () => {
    const game = { ...createGame(), over: true, winner: PLAYER_1 };
    render(
      <GameScreen
        game={game}
        onMove={() => {}}
        onUndo={() => {}}
        onRestart={() => {}}
        onMenu={() => {}}
        botMode
      />,
    );
    expect(screen.getByRole('dialog')).toHaveTextContent(/Ganaste/i);
  });

  it('restarts the game from the controls', async () => {
    const user = userEvent.setup();
    const game = gameAfterFirstMove();
    const onRestart = vi.fn();
    render(
      <GameScreen
        game={game}
        onMove={() => {}}
        onUndo={() => {}}
        onRestart={onRestart}
        onMenu={() => {}}
      />,
    );
    await user.click(screen.getByRole('button', { name: /reiniciar/i }));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it('goes back to the menu from the controls', async () => {
    const user = userEvent.setup();
    const onMenu = vi.fn();
    render(
      <GameScreen
        game={createGame()}
        onMove={() => {}}
        onUndo={() => {}}
        onRestart={() => {}}
        onMenu={onMenu}
      />,
    );
    await user.click(screen.getByRole('button', { name: /menú/i }));
    expect(onMenu).toHaveBeenCalledTimes(1);
  });

  it('in bot mode disables the board and warns while thinking', () => {
    const game = { ...createGame(), turn: PLAYER_2 };
    render(
      <GameScreen
        game={game}
        onMove={() => {}}
        onUndo={() => {}}
        onRestart={() => {}}
        onMenu={() => {}}
        botMode
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent(/pensando/i);
    expect(screen.getByRole('button', { name: 'Fila 6 columna 1' })).toBeDisabled();
  });
});
