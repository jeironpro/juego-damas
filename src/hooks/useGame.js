import { useEffect, useRef, useCallback, useState } from 'react';
import { createGame, applyMove, undoMove } from '@/features/game/game.js';
import { chooseMove } from '@/features/bot/bot.js';
import { PLAYER_2 } from '@/features/game/constants.js';

// Pausa para que se aprecie la jugada del bot
const BOT_DELAY_MS = 600;

// Estado de la partida: movimientos, deshacer y reinicio.
// Si se pasa botDifficulty, el bot (jugador 2) responde automáticamente a cada jugada.
export function useGame({ botDifficulty = null } = {}) {
  const [game, setGame] = useState(() => createGame());
  const botTimerRef = useRef(null);

  useEffect(() => {
    if (botDifficulty === null || game.over || game.turn !== PLAYER_2) return;
    if (botTimerRef.current !== null) return;
    // Se programa la jugada del bot; si el estado cambia antes (deshacer), se cancela
    botTimerRef.current = setTimeout(() => {
      botTimerRef.current = null;
      setGame((current) => {
        const move = chooseMove(current, botDifficulty);
        return move === null ? current : applyMove(current, move);
      });
    }, BOT_DELAY_MS);
    return () => {
      if (botTimerRef.current !== null) {
        clearTimeout(botTimerRef.current);
        botTimerRef.current = null;
      }
    };
  }, [game, botDifficulty]);

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
