import Piece from './Piece.jsx';

// Casilla del tablero: las jugables (oscuras) son botones; las claras son decorativas
function Square({ row, col, playable, piece, selected, isTarget, onClick, disabled }) {
  const className = [
    'board__square',
    playable ? 'board__square--dark' : 'board__square--light',
    selected ? 'board__square--selected' : '',
    isTarget ? 'board__square--target' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (!playable) {
    return <div className={className} aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Fila ${row + 1} columna ${col + 1}`}
      aria-pressed={selected}
    >
      {piece !== null && <Piece player={piece.player} king={piece.king} />}
      {isTarget && <span className="board__hint" aria-hidden="true" />}
    </button>
  );
}

export default Square;
