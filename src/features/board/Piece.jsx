import Icon from '@/components/ui/Icon.jsx'; // Ficha del tablero: las damas muestran una corona dorada en el centro (Material Symbols).
// Es decorativa: la casilla aporta la etiqueta accesible, por eso se oculta de la accesibilidad
function Piece({ player, king }) {
  const className = `piece piece--player-${player}${king ? ' piece--king' : ''}`;
  return (
    <span className={className} aria-hidden="true">
      {king && <Icon name="crown" className="piece__crown" />}
    </span>
  );
}

export default Piece;
