import { useMemo, useState, useCallback } from 'react';
import { BOARD_SIZE } from '@/features/game/constants.js';
import { isPlayableSquare } from '@/features/game/board.js';
import { getLegalMoves } from '@/features/game/moves.js';
import Square from './Square.jsx';
import './Board.css';

// Tablero 8x8: clic en una ficha propia para seleccionarla y clic en un destino para mover
function Board({ board, turn, onMove, disabled = false }) {
  const [selection, setSelection] = useState(null);

  // La selección solo es válida si la casilla aún contiene una ficha del jugador en turno;
  // así se descarta sola al mover, deshacer o reiniciar, sin efectos adicionales
  const selectedPiece = selection !== null ? board[selection.row]?.[selection.col] : null;
  const activeSelection =
    selectedPiece !== null && selectedPiece.player === turn ? selection : null;

  const legalMoves = useMemo(() => {
    if (activeSelection === null) return [];
    return getLegalMoves(board, turn).filter(
      (move) => move.from.row === activeSelection.row && move.from.col === activeSelection.col,
    );
  }, [board, turn, activeSelection]);

  const targetKeys = useMemo(
    () =>
      new Set(
        legalMoves.map(
          (move) =>
            `${move.landings[move.landings.length - 1].row},${move.landings[move.landings.length - 1].col}`,
        ),
      ),
    [legalMoves],
  );

  const handleSquareClick = useCallback(
    (row, col) => {
      if (disabled) return;
      const piece = board[row][col];
      if (activeSelection !== null) {
        const move = legalMoves.find((candidate) => {
          const last = candidate.landings[candidate.landings.length - 1];
          return last.row === row && last.col === col;
        });
        if (move !== undefined) {
          onMove(move);
          setSelection(null);
          return;
        }
      }
      setSelection(piece !== null && piece.player === turn ? { row, col } : null);
    },
    [board, disabled, legalMoves, onMove, activeSelection, turn],
  );

  const squares = Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => {
      const piece = board[row][col];
      const selected =
        activeSelection !== null && activeSelection.row === row && activeSelection.col === col;
      const isTarget = targetKeys.has(`${row},${col}`);
      return (
        <Square
          key={`${row}-${col}`}
          row={row}
          col={col}
          playable={isPlayableSquare(row, col)}
          piece={piece}
          selected={selected}
          isTarget={isTarget}
          onClick={() => handleSquareClick(row, col)}
          disabled={disabled}
        />
      );
    }),
  ).flat();

  return (
    <div className="board" role="grid" aria-label="Tablero de damas">
      {squares}
    </div>
  );
}

export default Board;
