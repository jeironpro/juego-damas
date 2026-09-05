import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { PLAYER_1, PLAYER_2 } from '@/features/game/constants.js';
import { getLegalMoves } from '@/features/game/moves.js';
import { useGame } from './useGame.js';

// Primer movimiento legal del jugador en turno
function firstMove(game) {
  return getLegalMoves(game.board, game.turn)[0];
}

describe('useGame', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('in local mode the turn changes only with user moves', () => {
    const { result } = renderHook(() => useGame({}));
    act(() => {
      result.current.makeMove(firstMove(result.current.game));
    });
    expect(result.current.game.turn).toBe(PLAYER_2);
  });

  it('in bot mode the bot answers after a pause', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useGame({ botDifficulty: 'facil' }));
    act(() => {
      result.current.makeMove(firstMove(result.current.game));
    });
    expect(result.current.game.turn).toBe(PLAYER_2);
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(result.current.game.turn).toBe(PLAYER_1);
  });

  it('cancels the bot move when undoing while it thinks', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useGame({ botDifficulty: 'facil' }));
    act(() => {
      result.current.makeMove(firstMove(result.current.game));
    });
    act(() => {
      result.current.undo();
    });
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(result.current.game.turn).toBe(PLAYER_1);
  });
});
