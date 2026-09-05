import Button from '@/components/ui/Button.jsx';
import Icon from '@/components/ui/Icon.jsx';
import Scoreboard from '@/features/scoreboard/Scoreboard.jsx';
import Board from '@/features/board/Board.jsx';
import { PLAYER_1, PLAYER_2 } from '@/features/game/constants.js';
import './GameScreen.css';

// Pantalla de partida: marcador arriba, tablero al centro y controles debajo
function GameScreen({
  game,
  onMove,
  onUndo,
  player1Name = 'Jugador 1',
  player2Name = 'Jugador 2',
  badge = null,
  botThinking = false,
}) {
  const undoDisabled = botThinking || game.undoUsed || game.history.length === 0 || game.over;
  const winnerName =
    game.winner === PLAYER_1 ? player1Name : game.winner === PLAYER_2 ? player2Name : null;

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
      <Board
        board={game.board}
        turn={game.turn}
        onMove={onMove}
        disabled={game.over || botThinking}
      />
      <div className="game-screen__controls">
        <Button variant="secondary" icon="undo" onClick={onUndo} disabled={undoDisabled}>
          Deshacer
        </Button>
      </div>
      {game.over && winnerName !== null && (
        <div className="game-screen__result" role="status">
          <Icon name="emoji_events" />
          <span>¡{winnerName} gana!</span>
        </div>
      )}
    </div>
  );
}

export default GameScreen;
