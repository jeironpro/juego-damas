import Icon from '@/components/ui/Icon.jsx';

// Ficha del tablero: las damas muestran una corona dorada en el centro (Material Symbols)
function Piece({ player, king }) {
  const className = `piece piece--player-${player}${king ? ' piece--king' : ''}`;
  return (
    <span className={className}>{king && <Icon name="crown" className="piece__crown" />}</span>
  );
}

export default Piece;
