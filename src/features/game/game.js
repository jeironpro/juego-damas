import { PLAYER_1, PLAYER_2, PIECES_PER_PLAYER } from './constants.js';
import { createInitialBoard, countPieces, switchPlayer } from './board.js';
import { getLegalMoves, applyMoveToBoard, isLegalMove } from './moves.js';

function countPiecesByPlayer(board) {
  return {
    [PLAYER_1]: countPieces(board, PLAYER_1),
    [PLAYER_2]: countPieces(board, PLAYER_2),
  };
}

export function createGame() {
  return {
    board: createInitialBoard(),
    turn: PLAYER_1,
    pieces: {
      [PLAYER_1]: PIECES_PER_PLAYER,
      [PLAYER_2]: PIECES_PER_PLAYER,
    },
    // Historial de estados { board, turn } anteriores, para poder deshacer una jugada
    history: [],
    undoUsed: false,
    over: false,
    winner: null,
  };
}

export function getLegalMovesForGame(game) {
  if (game.over) return [];
  return getLegalMoves(game.board, game.turn);
}

// Aplica un movimiento validándolo; devuelve un estado nuevo (inmutable)
export function applyMove(game, move) {
  if (game.over) throw new Error('La partida ya terminó');
  if (!isLegalMove(game.board, game.turn, move)) throw new Error('Movimiento no válido');

  const nextBoard = applyMoveToBoard(game.board, move);
  const nextTurn = switchPlayer(game.turn);
  const next = {
    ...game,
    board: nextBoard,
    turn: nextTurn,
    pieces: countPiecesByPlayer(nextBoard),
    history: [...game.history, { board: game.board, turn: game.turn }],
    over: false,
    winner: null,
  };

  // Fin de partida: el rival se quedó sin fichas o sin movimientos legales
  const rivalHasMoves = getLegalMoves(nextBoard, nextTurn).length > 0;
  if (next.pieces[nextTurn] === 0 || !rivalHasMoves) {
    next.over = true;
    next.winner = game.turn;
  }
  return next;
}

// Deshace la última jugada, una sola vez por partida; restaura fichas capturadas y turno
export function undoMove(game) {
  if (game.undoUsed || game.history.length === 0) return game;
  const previous = game.history[game.history.length - 1];
  return {
    ...game,
    board: previous.board,
    turn: previous.turn,
    pieces: countPiecesByPlayer(previous.board),
    history: game.history.slice(0, -1),
    undoUsed: true,
    over: false,
    winner: null,
  };
}
