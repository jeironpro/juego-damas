import Button from '@/components/ui/Button.jsx';
import Scoreboard from '@/features/scoreboard/Scoreboard.jsx';
import Board from '@/features/board/Board.jsx';
import GameOverScreen from '@/features/menu/GameOverScreen.jsx';
import { PLAYER_1, PLAYER_2 } from '@/features/game/constants.js';
import './GameScreen.css';

// Pantalla de partida: marcador arriba, tablero al centro y controles debajo.
// Con botMode activo, el tablero se bloquea mientras piensa el bot (jugador 2)
function GameScreen({
  game,
  onMove,
  onUndo,
  onRestart,
  onMenu,
  player1Name = 'Jugador 1',
  player2Name = 'Jugador 2',
  badge = null,
  botMode = false,
}) {
  const botTurn = botMode && game.turn === PLAYER_2 && !game.over;
  const undoDisabled = botTurn || game.undoUsed || game.history.length === 0 || game.over;
  const winnerName =
    game.winner === PLAYER_1 ? player1Name : game.winner === PLAYER_2 ? player2Name : null;
  const overTitle = botMode
    ? game.winner === PLAYER_1
      ? '¡Ganaste!'
      : '¡El bot ganó!'
    : winnerName !== null
      ? `¡${winnerName} gana!`
      : '';

  return (
    <div className="game-screen">
      <Scoreboard
        player1Name={player1Name}
        player2Name={player2Name}
        player1Count={game.pieces[PLAYER_1]}
        player2Count={game.pieces[PLAYER_2]}
        badge={badge}
        turn={game.turn}
      />
      <Board board={game.board} turn={game.turn} onMove={onMove} disabled={game.over || botTurn} />
      <div className="game-screen__controls">
        {botTurn && (
          <p className="game-screen__thinking" role="status">
            El bot está pensando…
          </p>
        )}
        <Button variant="secondary" icon="undo" onClick={onUndo} disabled={undoDisabled}>
          Deshacer
        </Button>
      </div>
      {game.over && winnerName !== null && (
        <GameOverScreen title={overTitle} onRestart={onRestart} onMenu={onMenu} />
      )}
    </div>
  );
}

export default GameScreen;
