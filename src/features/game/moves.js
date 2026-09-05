import { BOARD_SIZE, FORWARD_DIRECTION, PROMOTION_ROW } from './constants.js';
import { isInsideBoard, isPlayableSquare } from './board.js';

// Desplazamientos diagonales posibles: [fila, columna]
const DIAGONALS = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

function getDirections(piece) {
  if (piece.king) return DIAGONALS;
  const forward = FORWARD_DIRECTION[piece.player];
  return [
    [forward, -1],
    [forward, 1],
  ];
}

function isPromotionRow(row, player) {
  return row === PROMOTION_ROW[player];
}

function createMove(from, landings, captured) {
  return { from, landings, captured };
}

// Movimientos simples: un paso en diagonal a una casilla vacía
function getSimpleMoves(board, row, col, piece) {
  const moves = [];
  for (const [dr, dc] of getDirections(piece)) {
    const toRow = row + dr;
    const toCol = col + dc;
    if (!isInsideBoard(toRow, toCol)) continue;
    if (!isPlayableSquare(toRow, toCol)) continue;
    if (board[toRow][toCol] !== null) continue;
    moves.push(createMove({ row, col }, [{ row: toRow, col: toCol }], []));
  }
  return moves;
}

// Cadenas de captura desde la posición actual de una ficha.
// Se usa un tablero virtual donde las fichas capturadas y la casilla de origen quedan libres,
// lo que permite cadenas en zigzag e incluso volver a la casilla de inicio.
function getCaptureChains(board, row, col, piece) {
  const chains = [];
  for (const [dr, dc] of DIAGONALS) {
    const enemyRow = row + dr;
    const enemyCol = col + dc;
    const landingRow = row + 2 * dr;
    const landingCol = col + 2 * dc;
    if (!isInsideBoard(enemyRow, enemyCol) || !isInsideBoard(landingRow, landingCol)) continue;
    if (!isPlayableSquare(landingRow, landingCol)) continue;
    const enemy = board[enemyRow][enemyCol];
    if (enemy === null || enemy.player === piece.player) continue;
    if (board[landingRow][landingCol] !== null) continue;

    const virtualBoard = board.map((rowCells) => [...rowCells]);
    virtualBoard[enemyRow][enemyCol] = null;
    virtualBoard[row][col] = null;
    virtualBoard[landingRow][landingCol] = piece;

    const continuations = getCaptureChains(virtualBoard, landingRow, landingCol, piece);
    if (continuations.length === 0) {
      chains.push({
        landings: [{ row: landingRow, col: landingCol }],
        captured: [{ row: enemyRow, col: enemyCol }],
      });
    } else {
      for (const continuation of continuations) {
        chains.push({
          landings: [{ row: landingRow, col: landingCol }, ...continuation.landings],
          captured: [{ row: enemyRow, col: enemyCol }, ...continuation.captured],
        });
      }
    }
  }
  return chains;
}

// Movimientos legales del jugador indicado; si hay capturas disponibles, son obligatorias
export function getLegalMoves(board, player) {
  const pieces = [];
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const piece = board[row][col];
      if (piece !== null && piece.player === player) {
        pieces.push({ row, col, piece });
      }
    }
  }

  const captureMoves = [];
  const simpleMoves = [];
  for (const { row, col, piece } of pieces) {
    const chains = getCaptureChains(board, row, col, piece);
    for (const chain of chains) {
      captureMoves.push(createMove({ row, col }, chain.landings, chain.captured));
    }
    if (chains.length === 0) {
      simpleMoves.push(...getSimpleMoves(board, row, col, piece));
    }
  }

  // Captura obligatoria: si una ficha puede comer, no se permiten movimientos simples
  if (captureMoves.length > 0) return captureMoves;
  return simpleMoves;
}

export function moveKey(move) {
  const landings = move.landings.map((square) => `${square.row}:${square.col}`).join('-');
  return `${move.from.row}:${move.from.col}>${landings}`;
}

export function isLegalMove(board, player, move) {
  const key = moveKey(move);
  return getLegalMoves(board, player).some((legal) => moveKey(legal) === key);
}

// Aplica un movimiento al tablero devolviendo un tablero nuevo (inmutable)
export function applyMoveToBoard(board, move) {
  const next = board.map((rowCells) => [...rowCells]);
  const piece = next[move.from.row][move.from.col];
  if (piece === null) {
    throw new Error('No hay una ficha en la casilla de origen');
  }
  next[move.from.row][move.from.col] = null;
  for (const captured of move.captured) {
    next[captured.row][captured.col] = null;
  }
  const finalSquare = move.landings[move.landings.length - 1];
  next[finalSquare.row][finalSquare.col] = piece;
  // La ficha corona si pasó por la última fila durante la jugada (incluidas cadenas)
  const crowned = move.landings.some((square) => isPromotionRow(square.row, piece.player));
  if (crowned && !piece.king) {
    next[finalSquare.row][finalSquare.col] = { ...piece, king: true };
  }
  return next;
}
