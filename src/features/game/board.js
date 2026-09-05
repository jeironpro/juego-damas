import { BOARD_SIZE, PLAYER_1, PLAYER_2 } from './constants.js';

export function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

// Las casillas jugables son las de color oscuro: fila + columna impar (con la fila 0 arriba)
export function isPlayableSquare(row, col) {
  return (row + col) % 2 === 1;
}

export function isInsideBoard(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function createPiece(player) {
  return { player, king: false };
}

// Posición inicial: el jugador 1 ocupa las filas inferiores (5, 6 y 7) y el jugador 2 las superiores (0, 1 y 2)
export function createInitialBoard() {
  const board = createEmptyBoard();
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (!isPlayableSquare(row, col)) continue;
      if (row < 3) {
        board[row][col] = createPiece(PLAYER_2);
      } else if (row > 4) {
        board[row][col] = createPiece(PLAYER_1);
      }
    }
  }
  return board;
}

export function countPieces(board, player) {
  let count = 0;
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const piece = board[row][col];
      if (piece !== null && piece.player === player) count += 1;
    }
  }
  return count;
}

export function switchPlayer(player) {
  return player === PLAYER_1 ? PLAYER_2 : PLAYER_1;
}
