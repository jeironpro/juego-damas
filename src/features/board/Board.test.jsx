import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PLAYER_1, PLAYER_2 } from '@/features/game/constants.js';
import { createGame } from '@/features/game/game.js';
import { buildBoard } from '@/features/game/test-utils.js';
import Board from './Board.jsx';

describe('Board', () => {
  it('selects an own piece and highlights its legal destinations', async () => {
    const user = userEvent.setup();
    const game = createGame();
    render(<Board board={game.board} turn={game.turn} onMove={() => {}} />);
    // ficha del jugador 1 en (5,0): fila 6 columna 1
    await user.click(screen.getByRole('button', { name: 'Fila 6 columna 1' }));
    // su único destino legal es (4,1): fila 5 columna 2
    expect(screen.getByRole('button', { name: 'Fila 5 columna 2' })).toHaveClass(
      'board__square--target',
    );
  });

  it('sends the legal move when clicking the destination', async () => {
    const user = userEvent.setup();
    const game = createGame();
    const onMove = vi.fn();
    render(<Board board={game.board} turn={game.turn} onMove={onMove} />);
    await user.click(screen.getByRole('button', { name: 'Fila 6 columna 1' }));
    await user.click(screen.getByRole('button', { name: 'Fila 5 columna 2' }));
    expect(onMove).toHaveBeenCalledTimes(1);
    const move = onMove.mock.calls[0][0];
    expect(move.from).toEqual({ row: 5, col: 0 });
    expect(move.landings[move.landings.length - 1]).toEqual({ row: 4, col: 1 });
  });

  it('does not allow selecting the rival pieces', async () => {
    const user = userEvent.setup();
    const game = createGame();
    render(<Board board={game.board} turn={game.turn} onMove={() => {}} />);
    // ficha del jugador 2 en (0,1): fila 1 columna 2
    const rivalSquare = screen.getByRole('button', { name: 'Fila 1 columna 2' });
    await user.click(rivalSquare);
    expect(rivalSquare).not.toHaveClass('board__square--selected');
  });

  it('warns about the mandatory capture and highlights the capturing pieces', async () => {
    const user = userEvent.setup();
    const board = buildBoard([
      [3, 2, PLAYER_1],
      [2, 1, PLAYER_2],
      [7, 0, PLAYER_1],
    ]);
    render(<Board board={board} turn={PLAYER_1} onMove={() => {}} />);
    // la ficha (3,2) puede capturar: fila 4 columna 3
    const capturingSquare = screen.getByRole('button', { name: 'Fila 4 columna 3' });
    expect(capturingSquare).toHaveClass('board__square--can-capture');
    // sin selección se indica la captura obligatoria
    expect(screen.getByRole('status')).toHaveTextContent(/captura obligatoria/i);
    // al elegir una ficha que no puede capturar, se avisa
    await user.click(screen.getByRole('button', { name: 'Fila 8 columna 1' }));
    expect(screen.getByRole('status')).toHaveTextContent(/no puede capturar/i);
  });

  it('does not show the capture notice when there are no captures', () => {
    const game = createGame();
    render(<Board board={game.board} turn={game.turn} onMove={() => {}} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows the crown in the center of the king pieces', () => {
    const board = buildBoard([
      [4, 3, PLAYER_1, true],
      [5, 4, PLAYER_2],
    ]);
    render(<Board board={board} turn={PLAYER_1} onMove={() => {}} />);
    const kingSquare = screen.getByRole('button', { name: 'Fila 5 columna 4' });
    expect(kingSquare.querySelector('.piece__crown')).toBeInTheDocument();
    const manSquare = screen.getByRole('button', { name: 'Fila 6 columna 5' });
    expect(manSquare.querySelector('.piece__crown')).not.toBeInTheDocument();
  });

  it('ignores clicks when the board is disabled', async () => {
    const user = userEvent.setup();
    const game = createGame();
    const onMove = vi.fn();
    render(<Board board={game.board} turn={game.turn} onMove={onMove} disabled />);
    await user.click(screen.getByRole('button', { name: 'Fila 6 columna 1' }));
    await user.click(screen.getByRole('button', { name: 'Fila 5 columna 2' }));
    expect(onMove).not.toHaveBeenCalled();
  });
});
