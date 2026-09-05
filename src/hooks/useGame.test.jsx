import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { PLAYER_1, PLAYER_2 } from '@/features/game/constants.js';
import { getLegalMovesForGame } from '@/features/game/game.js';
import { useGame } from './useGame.js';

describe('useGame', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('en modo local el turno cambia solo con movimientos del usuario', () => {
    const { result } = renderHook(() => useGame({}));
    const move = getLegalMovesForGame(result.current.game)[0];
    act(() => {
      result.current.makeMove(move);
    });
    expect(result.current.game.turn).toBe(PLAYER_2);
  });

  it('en modo bot, el bot responde tras una pausa', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useGame({ botDifficulty: 'facil' }));
    const move = getLegalMovesForGame(result.current.game)[0];
    act(() => {
      result.current.makeMove(move);
    });
    expect(result.current.game.turn).toBe(PLAYER_2);
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(result.current.game.turn).toBe(PLAYER_1);
  });

  it('cancela la jugada del bot si se deshace mientras piensa', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useGame({ botDifficulty: 'facil' }));
    act(() => {
      result.current.makeMove(getLegalMovesForGame(result.current.game)[0]);
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
