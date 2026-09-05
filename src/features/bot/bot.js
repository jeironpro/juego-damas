import { BOARD_SIZE, PLAYER_1 } from '@/features/game/constants.js';
import { switchPlayer } from '@/features/game/board.js';
import { getLegalMoves, applyMoveToBoard } from '@/features/game/moves.js';
import { DIFFICULTY_DEPTHS } from './difficulty.js';

// Valores de la heurística (material y avance)
const MAN_VALUE = 100;
const KING_VALUE = 160;
const ADVANCE_BONUS = 2;

// Puntuación que representa una victoria segura
const LOSS_SCORE = 1_000_000;

// Evalúa un bando: material más bonificación por acercarse a la coronación
function evaluateSide(board, player) {
  let score = 0;
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const piece = board[row][col];
      if (piece === null || piece.player !== player) continue;
      score += piece.king ? KING_VALUE : MAN_VALUE;
      if (!piece.king) {
        const distance = player === PLAYER_1 ? row : BOARD_SIZE - 1 - row;
        score += distance * ADVANCE_BONUS;
      }
    }
  }
  return score;
}

// Evalúa el tablero desde la perspectiva del jugador indicado
function evaluate(board, player) {
  return evaluateSide(board, player) - evaluateSide(board, switchPlayer(player));
}

// Ordena las jugadas poniendo primero las capturas más largas (mejora la poda alfa-beta)
function orderMoves(moves) {
  return [...moves].sort((a, b) => b.captured.length - a.captured.length);
}

// Búsqueda minimax con poda alfa-beta; el signo alterna según el turno
function search(board, botPlayer, depth, alpha, beta) {
  const playerToMove = depth % 2 === 0 ? botPlayer : switchPlayer(botPlayer);
  const moves = getLegalMoves(board, playerToMove);
  if (moves.length === 0) {
    // el jugador al que le toca mover no puede: pierde
    return depth % 2 === 0 ? -LOSS_SCORE : LOSS_SCORE;
  }
  if (depth === 0) {
    return evaluate(board, botPlayer);
  }

  if (depth % 2 === 0) {
    // turno del bot: maximizar
    let best = -Infinity;
    for (const move of orderMoves(moves)) {
      const score = search(applyMoveToBoard(board, move), botPlayer, depth - 1, alpha, beta);
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  }

  // turno del rival: minimizar
  let best = Infinity;
  for (const move of orderMoves(moves)) {
    const score = search(applyMoveToBoard(board, move), botPlayer, depth - 1, alpha, beta);
    best = Math.min(best, score);
    beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }
  return best;
}

// Nivel fácil: elige entre la mejor jugada inmediata y una aleatoria, con sesgo hacia la mejor
function pickGreedyMove(moves, board, player, random) {
  const scored = moves.map((move) => ({
    move,
    score: evaluate(applyMoveToBoard(board, move), player),
  }));
  const bestScore = Math.max(...scored.map((entry) => entry.score));
  const bestMoves = scored.filter((entry) => entry.score === bestScore).map((entry) => entry.move);
  if (random() < 0.7) {
    return bestMoves[Math.floor(random() * bestMoves.length)];
  }
  return moves[Math.floor(random() * moves.length)];
}

// Elige la jugada del bot para el jugador en turno según la dificultad
export function chooseMove(game, difficulty, random = Math.random) {
  const moves = getLegalMoves(game.board, game.turn);
  if (moves.length === 0) return null;

  const depth = DIFFICULTY_DEPTHS[difficulty];
  if (depth <= 1) {
    return pickGreedyMove(moves, game.board, game.turn, random);
  }

  let bestScore = -Infinity;
  let bestMoves = [];
  for (const move of orderMoves(moves)) {
    const nextBoard = applyMoveToBoard(game.board, move);
    const score = search(nextBoard, game.turn, depth - 1, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }
  // pequeña variedad entre jugadas igualmente buenas
  return bestMoves[Math.floor(random() * bestMoves.length)];
}
