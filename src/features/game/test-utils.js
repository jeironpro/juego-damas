import { createEmptyBoard } from './board.js';

// Construye un tablero con fichas en las posiciones indicadas:
// cada entrada es [fila, columna, jugador, esDama?]
export function buildBoard(specs) {
  const board = createEmptyBoard();
  for (const [row, col, player, king = false] of specs) {
    board[row][col] = { player, king };
  }
  return board;
}
