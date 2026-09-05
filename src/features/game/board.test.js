import { describe, it, expect } from 'vitest';
import { BOARD_SIZE, PLAYER_1, PLAYER_2 } from './constants.js';
import { createEmptyBoard, createInitialBoard, isPlayableSquare, countPieces } from './board.js';

describe('isPlayableSquare', () => {
  it('considers only the dark squares playable (odd row + column)', () => {
    expect(isPlayableSquare(0, 0)).toBe(false);
    expect(isPlayableSquare(0, 1)).toBe(true);
    expect(isPlayableSquare(5, 0)).toBe(true);
    expect(isPlayableSquare(7, 7)).toBe(false);
  });
});

describe('createEmptyBoard', () => {
  it('creates an 8x8 board without pieces', () => {
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
  it('places 12 pieces for each player', () => {
    const board = createInitialBoard();
    expect(countPieces(board, PLAYER_1)).toBe(12);
    expect(countPieces(board, PLAYER_2)).toBe(12);
  });

  it('places player 2 at the top and player 1 at the bottom', () => {
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

  it('leaves the central rows and the light squares empty', () => {
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
