import { describe, it, expect } from 'vitest';
import { PLAYER_1, PLAYER_2 } from './constants.js';
import { createInitialBoard, countPieces } from './board.js';
import { getLegalMoves, applyMoveToBoard, moveKey, isLegalMove } from './moves.js';
import { buildBoard } from './test-utils.js';

describe('getLegalMoves — posición inicial', () => {
  it('el jugador 1 dispone de 7 movimientos simples', () => {
    const board = createInitialBoard();
    const moves = getLegalMoves(board, PLAYER_1);
    expect(moves).toHaveLength(7);
    for (const move of moves) {
      expect(move.captured).toHaveLength(0);
      expect(move.landings).toHaveLength(1);
    }
  });

  it('las fichas del jugador 1 no retroceden en un movimiento simple', () => {
    const board = buildBoard([[5, 0, PLAYER_1]]);
    const moves = getLegalMoves(board, PLAYER_1);
    // la única diagonal libre es hacia delante: (4,1)
    expect(moves).toHaveLength(1);
    expect(moveKey(moves[0])).toBe('5:0>4:1');
  });
});

describe('getLegalMoves — capturas', () => {
  it('la captura es obligatoria: con capturas disponibles no se devuelven movimientos simples', () => {
    const board = buildBoard([
      [3, 2, PLAYER_1],
      [2, 1, PLAYER_2],
      [4, 1, PLAYER_2],
      [4, 3, PLAYER_2],
    ]);
    const moves = getLegalMoves(board, PLAYER_1);
    // tres capturas posibles y un movimiento simple a (2,3), que no debe aparecer
    expect(moves).toHaveLength(3);
    for (const move of moves) {
      expect(move.captured).toHaveLength(1);
      expect(moveKey(move)).not.toBe('3:2>2:3');
    }
  });

  it('la ficha puede capturar hacia atrás (regla española)', () => {
    const board = buildBoard([
      [4, 3, PLAYER_1],
      [5, 4, PLAYER_2],
    ]);
    const moves = getLegalMoves(board, PLAYER_1);
    expect(moves).toHaveLength(1);
    expect(moveKey(moves[0])).toBe('4:3>6:5');
    expect(moves[0].captured).toEqual([{ row: 5, col: 4 }]);
  });

  it('genera cadenas de captura múltiple', () => {
    const board = buildBoard([
      [5, 0, PLAYER_1],
      [4, 1, PLAYER_2],
      [4, 3, PLAYER_2],
    ]);
    const moves = getLegalMoves(board, PLAYER_1);
    const chain = moves.find((move) => move.captured.length === 2);
    expect(chain).toBeDefined();
    expect(chain.landings).toEqual([
      { row: 3, col: 2 },
      { row: 5, col: 4 },
    ]);
  });

  it('permite cadenas que vuelven a la casilla de origen', () => {
    const board = buildBoard([
      [5, 2, PLAYER_1],
      [4, 3, PLAYER_2],
      [2, 3, PLAYER_2],
      [2, 1, PLAYER_2],
      [4, 1, PLAYER_2],
    ]);
    const moves = getLegalMoves(board, PLAYER_1);
    const loop = moves.find((move) => move.captured.length === 4);
    expect(loop).toBeDefined();
    expect(loop.landings[loop.landings.length - 1]).toEqual({ row: 5, col: 2 });
  });
});

describe('coronación', () => {
  it('una ficha que llega a la última fila se convierte en dama', () => {
    const board = buildBoard([[1, 0, PLAYER_1]]);
    const move = getLegalMoves(board, PLAYER_1).find((m) => moveKey(m) === '1:0>0:1');
    expect(move).toBeDefined();
    const next = applyMoveToBoard(board, move);
    expect(next[0][1]).toEqual({ player: PLAYER_1, king: true });
  });

  it('una ficha corona también al final de una cadena de captura', () => {
    const board = buildBoard([
      [2, 1, PLAYER_1],
      [1, 2, PLAYER_2],
    ]);
    const moves = getLegalMoves(board, PLAYER_1);
    expect(moves).toHaveLength(1);
    const next = applyMoveToBoard(board, moves[0]);
    expect(next[0][3]).toEqual({ player: PLAYER_1, king: true });
    expect(next[1][2]).toBeNull();
  });

  it('una dama conserva su condición al moverse a la última fila', () => {
    const board = buildBoard([[1, 0, PLAYER_1, true]]);
    const move = getLegalMoves(board, PLAYER_1).find((m) => moveKey(m) === '1:0>0:1');
    expect(move).toBeDefined();
    const next = applyMoveToBoard(board, move);
    expect(next[0][1]).toEqual({ player: PLAYER_1, king: true });
  });
});

describe('damas', () => {
  it('una dama se mueve en las cuatro diagonales', () => {
    const board = buildBoard([[3, 2, PLAYER_1, true]]);
    const moves = getLegalMoves(board, PLAYER_1);
    expect(moves).toHaveLength(4);
    const keys = moves.map(moveKey).sort();
    expect(keys).toEqual(['3:2>2:1', '3:2>2:3', '3:2>4:1', '3:2>4:3'].sort());
  });
});

describe('applyMoveToBoard', () => {
  it('retira las fichas capturadas y mueve la ficha', () => {
    const board = buildBoard([
      [4, 3, PLAYER_1],
      [5, 4, PLAYER_2],
    ]);
    const move = getLegalMoves(board, PLAYER_1)[0];
    const next = applyMoveToBoard(board, move);
    expect(next[4][3]).toBeNull();
    expect(next[5][4]).toBeNull();
    expect(next[6][5]).toEqual({ player: PLAYER_1, king: false });
    expect(countPieces(next, PLAYER_2)).toBe(0);
  });

  it('lanza error si no hay ficha en la casilla de origen', () => {
    const board = createInitialBoard();
    expect(() =>
      applyMoveToBoard(board, {
        from: { row: 3, col: 2 },
        landings: [{ row: 2, col: 1 }],
        captured: [],
      }),
    ).toThrow();
  });
});

describe('isLegalMove', () => {
  it('distingue movimientos legales de ilegales', () => {
    const board = createInitialBoard();
    const legal = getLegalMoves(board, PLAYER_1)[0];
    expect(isLegalMove(board, PLAYER_1, legal)).toBe(true);
    expect(
      isLegalMove(board, PLAYER_1, {
        from: { row: 5, col: 0 },
        landings: [{ row: 6, col: 1 }],
        captured: [],
      }),
    ).toBe(false);
  });
});
