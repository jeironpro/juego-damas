import Button from '@/components/ui/Button.jsx';
import Icon from '@/components/ui/Icon.jsx';
import './GameOverScreen.css';

// Modal de fin de partida: título del ganador y acciones (jugar de nuevo o volver al menú)
function GameOverScreen({ title, onRestart, onMenu }) {
  return (
    <div className="game-over" role="dialog" aria-modal="true" aria-label="Fin de partida">
      <div className="game-over__card">
        <Icon name="emoji_events" />
        <h2 className="game-over__title">{title}</h2>
        <div className="game-over__actions">
          <Button icon="restart_alt" onClick={onRestart}>
            Jugar de nuevo
          </Button>
          <Button variant="secondary" onClick={onMenu}>
            Volver al menú
          </Button>
        </div>
      </div>
    </div>
  );
}

export default GameOverScreen;
