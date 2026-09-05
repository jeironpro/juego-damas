import { describe, it, expect } from 'vitest';
import { PLAYER_1, PLAYER_2 } from './constants.js';
import { createInitialBoard } from './board.js';
import { createGame, applyMove, undoMove, getLegalMovesForGame } from './game.js';
import { buildBoard } from './test-utils.js';

// Busca el movimiento legal que lleva de un origen a un destino dados
function moveFrom(game, fromRow, fromCol, destination) {
  const legal = getLegalMovesForGame(game).find((move) => {
    const last = move.landings[move.landings.length - 1];
    return (
      move.from.row === fromRow &&
      move.from.col === fromCol &&
      last.row === destination.row &&
      last.col === destination.col
    );
  });
  if (!legal) throw new Error('Movimiento no disponible');
  return legal;
}

describe('createGame', () => {
  it('inicia con 12 fichas por jugador, turno del jugador 1 y partida activa', () => {
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
  it('cambia el turno y registra el estado anterior en el historial', () => {
    const game = createGame();
    const next = applyMove(game, moveFrom(game, 5, 0, { row: 4, col: 1 }));
    expect(next.turn).toBe(PLAYER_2);
    expect(next.history).toHaveLength(1);
    expect(next.board).not.toBe(game.board);
  });

  it('descuenta las fichas capturadas del rival', () => {
    const game = {
      ...createGame(),
      board: buildBoard([
        [4, 3, PLAYER_1],
        [5, 4, PLAYER_2],
        [2, 1, PLAYER_2],
        [6, 3, PLAYER_2],
      ]),
    };
    const move = getLegalMovesForGame(game)[0];
    const next = applyMove(game, move);
    expect(next.pieces[PLAYER_2]).toBe(2);
    expect(next.pieces[PLAYER_1]).toBe(1);
  });

  it('descuenta todas las fichas de una cadena de captura', () => {
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
    const chain = getLegalMovesForGame(game).find((move) => move.captured.length === 2);
    const next = applyMove(game, chain);
    expect(next.pieces[PLAYER_2]).toBe(2);
  });

  it('declara ganador al jugador que deja al rival sin fichas', () => {
    const game = {
      ...createGame(),
      board: buildBoard([
        [3, 2, PLAYER_1],
        [2, 1, PLAYER_2],
      ]),
    };
    const next = applyMove(game, getLegalMovesForGame(game)[0]);
    expect(next.over).toBe(true);
    expect(next.winner).toBe(PLAYER_1);
  });

  it('declara ganador al jugador que deja al rival sin movimientos', () => {
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
    const move = getLegalMovesForGame(game).find((m) => m.from.row === 3);
    const next = applyMove(game, move);
    expect(next.over).toBe(true);
    expect(next.winner).toBe(PLAYER_1);
  });

  it('lanza error al aplicar un movimiento ilegal', () => {
    const game = createGame();
    expect(() =>
      applyMove(game, {
        from: { row: 5, col: 0 },
        landings: [{ row: 6, col: 1 }],
        captured: [],
      }),
    ).toThrow('Movimiento no válido');
  });

  it('lanza error al mover en una partida terminada', () => {
    const game = { ...createGame(), over: true };
    expect(() =>
      applyMove(game, {
        from: { row: 5, col: 0 },
        landings: [{ row: 4, col: 1 }],
        captured: [],
      }),
    ).toThrow('La partida ya terminó');
  });

  it('no devuelve movimientos en partidas terminadas', () => {
    const game = { ...createGame(), over: true };
    expect(getLegalMovesForGame(game)).toHaveLength(0);
  });
});

describe('undoMove', () => {
  it('restaura el tablero, el turno y las fichas capturadas', () => {
    const game = {
      ...createGame(),
      board: buildBoard([
        [4, 3, PLAYER_1],
        [5, 4, PLAYER_2],
        [2, 1, PLAYER_2],
        [6, 3, PLAYER_2],
      ]),
    };
    const after = applyMove(game, getLegalMovesForGame(game)[0]);
    expect(after.pieces[PLAYER_2]).toBe(2);
    const undone = undoMove(after);
    expect(undone.board).toEqual(game.board);
    expect(undone.turn).toBe(PLAYER_1);
    expect(undone.pieces[PLAYER_2]).toBe(3);
    expect(undone.undoUsed).toBe(true);
    expect(undone.history).toHaveLength(0);
  });

  it('solo permite deshacer una jugada por partida', () => {
    const game = createGame();
    const after = applyMove(game, moveFrom(game, 5, 0, { row: 4, col: 1 }));
    const undone = undoMove(after);
    const secondUndo = undoMove(undone);
    expect(secondUndo).toBe(undone);
  });

  it('no hace nada si aún no hay jugadas', () => {
    const game = createGame();
    expect(undoMove(game)).toBe(game);
  });

  it('revive una partida terminada al deshacer', () => {
    const game = {
      ...createGame(),
      board: buildBoard([
        [3, 2, PLAYER_1],
        [2, 1, PLAYER_2],
      ]),
    };
    const after = applyMove(game, getLegalMovesForGame(game)[0]);
    expect(after.over).toBe(true);
    const undone = undoMove(after);
    expect(undone.over).toBe(false);
    expect(undone.winner).toBeNull();
  });

  it('conserva el tablero inicial tras deshacer la primera jugada', () => {
    const game = createGame();
    const after = applyMove(game, moveFrom(game, 5, 0, { row: 4, col: 1 }));
    const undone = undoMove(after);
    expect(undone.board).toEqual(createInitialBoard());
  });
});
