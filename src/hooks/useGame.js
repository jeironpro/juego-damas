import { useCallback, useState } from 'react';
import { createGame, applyMove, undoMove } from '@/features/game/game.js';

// Estado de la partida: movimientos, deshacer y reinicio (la lógica vive en features/game)
export function useGame() {
  const [game, setGame] = useState(() => createGame());

  const makeMove = useCallback((move) => {
    setGame((current) => applyMove(current, move));
  }, []);

  const undo = useCallback(() => {
    setGame((current) => undoMove(current));
  }, []);

  const restart = useCallback(() => {
    setGame(createGame());
  }, []);

  return { game, makeMove, undo, restart };
}
