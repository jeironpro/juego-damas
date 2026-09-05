// Ficha del tablero: la condición de dama se indica con un anillo dorado (CSS)
function Piece({ player, king }) {
  const className = `piece piece--player-${player}${king ? ' piece--king' : ''}`;
  return <span className={className} aria-hidden="true" />;
}

export default Piece;
