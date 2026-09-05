import { describe, it, expect } from 'vitest';
import { BOARD_SIZE, PLAYER_1, PLAYER_2 } from './constants.js';
import { createEmptyBoard, createInitialBoard, isPlayableSquare, countPieces } from './board.js';

describe('isPlayableSquare', () => {
  it('considera jugables solo las casillas oscuras (fila + columna impar)', () => {
    expect(isPlayableSquare(0, 0)).toBe(false);
    expect(isPlayableSquare(0, 1)).toBe(true);
    expect(isPlayableSquare(5, 0)).toBe(true);
    expect(isPlayableSquare(7, 7)).toBe(false);
  });
});

describe('createEmptyBoard', () => {
  it('crea un tablero de 8x8 sin fichas', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(BOARD_SIZE);
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      expect(board[row]).toHaveLength(BOARD_SIZE);
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        expect(board[row][col]).toBeNull();
      }
    }
  });
});

describe('createInitialBoard', () => {
  it('coloca 12 fichas de cada jugador', () => {
    const board = createInitialBoard();
    expect(countPieces(board, PLAYER_1)).toBe(12);
    expect(countPieces(board, PLAYER_2)).toBe(12);
  });

  it('coloca al jugador 2 arriba y al jugador 1 abajo', () => {
    const board = createInitialBoard();
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        if (isPlayableSquare(row, col)) {
          expect(board[row][col]?.player).toBe(PLAYER_2);
        }
      }
    }
    for (let row = 5; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        if (isPlayableSquare(row, col)) {
          expect(board[row][col]?.player).toBe(PLAYER_1);
        }
      }
    }
  });

  it('deja vacías las filas centrales y las casillas claras', () => {
    const board = createInitialBoard();
    for (let row = 3; row <= 4; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        expect(board[row][col]).toBeNull();
      }
    }
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        if (!isPlayableSquare(row, col)) {
          expect(board[row][col]).toBeNull();
        }
      }
    }
  });
});
