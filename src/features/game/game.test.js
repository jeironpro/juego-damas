import { describe, it, expect } from 'vitest';
import { PLAYER_1, PLAYER_2 } from './constants.js';
import { createInitialBoard } from './board.js';
import { createGame, applyMove, undoMove } from './game.js';
import { getLegalMoves } from './moves.js';
import { buildBoard } from './test-utils.js';

// Busca el movimiento legal que lleva de un origen a un destino dados
function moveFrom(game, fromRow, fromCol, destination) {
  const legal = getLegalMoves(game.board, game.turn).find((move) => {
    const last = move.landings[move.landings.length - 1];
    return (
      move.from.row === fromRow &&
      move.from.col === fromCol &&
      last.row === destination.row &&
      last.col === destination.col
    );
  });
  if (!legal) throw new Error('Move not available');
  return legal;
}

describe('createGame', () => {
  it('starts with 12 pieces per player, player 1 turn and an active game', () => {
    const game = createGame();
    expect(game.pieces[PLAYER_1]).toBe(12);
    expect(game.pieces[PLAYER_2]).toBe(12);
    expect(game.turn).toBe(PLAYER_1);
    expect(game.over).toBe(false);
    expect(game.winner).toBeNull();
    expect(game.history).toHaveLength(0);
    expect(game.undoUsed).toBe(false);
  });
});

describe('applyMove', () => {
  it('switches the turn and records the previous state in the history', () => {
    const game = createGame();
    const next = applyMove(game, moveFrom(game, 5, 0, { row: 4, col: 1 }));
    expect(next.turn).toBe(PLAYER_2);
    expect(next.history).toHaveLength(1);
    expect(next.board).not.toBe(game.board);
  });

  it('decreases the captured pieces of the rival', () => {
    const game = {
      ...createGame(),
      board: buildBoard([
        [4, 3, PLAYER_1],
        [5, 4, PLAYER_2],
        [2, 1, PLAYER_2],
        [6, 3, PLAYER_2],
      ]),
    };
    const move = getLegalMoves(game.board, game.turn)[0];
    const next = applyMove(game, move);
    expect(next.pieces[PLAYER_2]).toBe(2);
    expect(next.pieces[PLAYER_1]).toBe(1);
  });

  it('decreases all the pieces of a capture chain', () => {
    const game = {
      ...createGame(),
      board: buildBoard([
        [5, 0, PLAYER_1],
        [4, 1, PLAYER_2],
        [4, 3, PLAYER_2],
        [2, 1, PLAYER_2],
        [6, 5, PLAYER_2],
      ]),
    };
    const chain = getLegalMoves(game.board, game.turn).find((move) => move.captured.length === 2);
    const next = applyMove(game, chain);
    expect(next.pieces[PLAYER_2]).toBe(2);
  });

  it('declares the winner when the rival runs out of pieces', () => {
    const game = {
      ...createGame(),
      board: buildBoard([
        [3, 2, PLAYER_1],
        [2, 1, PLAYER_2],
      ]),
    };
    const next = applyMove(game, getLegalMoves(game.board, game.turn)[0]);
    expect(next.over).toBe(true);
    expect(next.winner).toBe(PLAYER_1);
  });

  it('declares the winner when the rival has no moves', () => {
    const game = {
      ...createGame(),
      board: buildBoard([
        [3, 2, PLAYER_1],
        [6, 1, PLAYER_1],
        [5, 2, PLAYER_1],
        [7, 0, PLAYER_2],
      ]),
    };
    // el jugador 1 mueve su ficha central; el jugador 2 queda bloqueado en (7,0)
    // sin movimientos ni capturas posibles
    const move = getLegalMoves(game.board, game.turn).find((m) => m.from.row === 3);
    const next = applyMove(game, move);
    expect(next.over).toBe(true);
    expect(next.winner).toBe(PLAYER_1);
  });

  it('throws when applying an invalid move', () => {
    const game = createGame();
    expect(() =>
      applyMove(game, {
        from: { row: 5, col: 0 },
        landings: [{ row: 6, col: 1 }],
        captured: [],
      }),
    ).toThrow('Invalid move');
  });

  it('throws when moving in a finished game', () => {
    const game = { ...createGame(), over: true };
    expect(() =>
      applyMove(game, {
        from: { row: 5, col: 0 },
        landings: [{ row: 4, col: 1 }],
        captured: [],
      }),
    ).toThrow('The game has already ended');
  });
});

describe('undoMove', () => {
  it('restores the board, the turn and the captured pieces', () => {
    const game = {
      ...createGame(),
      board: buildBoard([
        [4, 3, PLAYER_1],
        [5, 4, PLAYER_2],
        [2, 1, PLAYER_2],
        [6, 3, PLAYER_2],
      ]),
    };
    const after = applyMove(game, getLegalMoves(game.board, game.turn)[0]);
    expect(after.pieces[PLAYER_2]).toBe(2);
    const undone = undoMove(after);
    expect(undone.board).toEqual(game.board);
    expect(undone.turn).toBe(PLAYER_1);
    expect(undone.pieces[PLAYER_2]).toBe(3);
    expect(undone.undoUsed).toBe(true);
    expect(undone.history).toHaveLength(0);
  });

  it('allows undoing only one move per game', () => {
    const game = createGame();
    const after = applyMove(game, moveFrom(game, 5, 0, { row: 4, col: 1 }));
    const undone = undoMove(after);
    const secondUndo = undoMove(undone);
    expect(secondUndo).toBe(undone);
  });

  it('does nothing when there are no moves yet', () => {
    const game = createGame();
    expect(undoMove(game)).toBe(game);
  });

  it('revives a finished game when undoing', () => {
    const game = {
      ...createGame(),
      board: buildBoard([
        [3, 2, PLAYER_1],
        [2, 1, PLAYER_2],
      ]),
    };
    const after = applyMove(game, getLegalMoves(game.board, game.turn)[0]);
    expect(after.over).toBe(true);
    const undone = undoMove(after);
    expect(undone.over).toBe(false);
    expect(undone.winner).toBeNull();
  });

  it('keeps the initial board after undoing the first move', () => {
    const game = createGame();
    const after = applyMove(game, moveFrom(game, 5, 0, { row: 4, col: 1 }));
    const undone = undoMove(after);
    expect(undone.board).toEqual(createInitialBoard());
  });
});
