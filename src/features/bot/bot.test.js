import { describe, it, expect } from 'vitest';
import { PLAYER_1, PLAYER_2 } from '@/features/game/constants.js';
import { createGame, applyMove } from '@/features/game/game.js';
import { getLegalMoves, moveKey } from '@/features/game/moves.js';
import { buildBoard } from '@/features/game/test-utils.js';
import { chooseMove } from './bot.js';
import { DIFFICULTIES, DIFFICULTY_LABELS, DIFFICULTY_DEPTHS } from './difficulty.js';

// Posición en la que el jugador 2 acaba de mover (le toca al bot)
function botTurnGame() {
  const game = createGame();
  const firstMove = getLegalMoves(game.board, PLAYER_1)[0];
  return applyMove(game, firstMove);
}

describe('chooseMove', () => {
  it('siempre devuelve un movimiento legal en todos los niveles', () => {
    const game = botTurnGame();
    for (const difficulty of DIFFICULTIES) {
      const move = chooseMove(game, difficulty, () => 0.5);
      expect(move).not.toBeNull();
      const legalMoves = getLegalMoves(game.board, game.turn);
      expect(legalMoves.some((legal) => moveKey(legal) === moveKey(move))).toBe(true);
    }
  });

  it('devuelve null si el bot no tiene movimientos', () => {
    const game = { ...createGame(), board: buildBoard([[0, 1, PLAYER_1]]), turn: PLAYER_2 };
    expect(chooseMove(game, 'dificil')).toBeNull();
  });

  it('prioriza la cadena de captura más larga en los niveles medio y difícil', () => {
    // la ficha del bot puede capturar una pieza (3,2) o dos en cadena (5,2) y (5,4)
    const game = {
      ...createGame(),
      turn: PLAYER_2,
      board: buildBoard([
        [4, 1, PLAYER_2],
        [3, 2, PLAYER_1],
        [5, 2, PLAYER_1],
        [5, 4, PLAYER_1],
      ]),
    };
    for (const difficulty of ['medio', 'dificil']) {
      const move = chooseMove(game, difficulty, () => 0.5);
      expect(move.captured).toHaveLength(2);
    }
  });

  it('es determinista con la misma semilla de azar', () => {
    const game = botTurnGame();
    const first = chooseMove(game, 'dificil', () => 0.42);
    const second = chooseMove(game, 'dificil', () => 0.42);
    expect(moveKey(first)).toBe(moveKey(second));
  });

  it('resuelve posiciones de medio juego con la dificultad alta', () => {
    const game = botTurnGame();
    const botMove = chooseMove(game, 'dificil', () => 0.5);
    expect(botMove).not.toBeNull();
    const legalMoves = getLegalMoves(game.board, game.turn);
    expect(legalMoves.some((legal) => moveKey(legal) === moveKey(botMove))).toBe(true);
  });
});

describe('difficulty', () => {
  it('define etiquetas y profundidades para todos los niveles', () => {
    expect(DIFFICULTY_LABELS.facil).toBe('Fácil');
    expect(DIFFICULTY_LABELS.medio).toBe('Medio');
    expect(DIFFICULTY_LABELS.dificil).toBe('Difícil');
    expect(Object.keys(DIFFICULTY_LABELS)).toEqual(DIFFICULTIES);
    expect(DIFFICULTY_DEPTHS.dificil).toBeGreaterThan(DIFFICULTY_DEPTHS.facil);
  });
});
