import { useMemo, useState, useCallback } from 'react';
import { BOARD_SIZE } from '@/features/game/constants.js';
import { isPlayableSquare } from '@/features/game/board.js';
import { getLegalMoves } from '@/features/game/moves.js';
import Square from './Square.jsx';
import './Board.css';

// Tablero 8x8: clic en una ficha propia para seleccionarla y clic en un destino para mover.
// Cuando hay captura obligatoria se resaltan las fichas que pueden comer y se avisa al jugador.
function Board({ board, turn, onMove, disabled = false }) {
  const [selection, setSelection] = useState(null);

  // La selección solo es válida si la casilla aún contiene una ficha del jugador en turno;
  // así se descarta sola al mover, deshacer o reiniciar, sin efectos adicionales
  const selectedPiece = selection !== null ? board[selection.row]?.[selection.col] : null;
  const activeSelection =
    selectedPiece !== null && selectedPiece.player === turn ? selection : null;

  // Movimientos legales del turno (con captura obligatoria solo habrá capturas)
  const allMoves = useMemo(
    () => (disabled ? [] : getLegalMoves(board, turn)),
    [board, turn, disabled],
  );

  // Orígenes de las fichas que pueden capturar
  const captureOrigins = useMemo(
    () =>
      new Set(
        allMoves
          .filter((move) => move.captured.length > 0)
          .map((move) => `${move.from.row},${move.from.col}`),
      ),
    [allMoves],
  );

  const legalMoves = useMemo(() => {
    if (activeSelection === null) return [];
    return allMoves.filter(
      (move) => move.from.row === activeSelection.row && move.from.col === activeSelection.col,
    );
  }, [allMoves, activeSelection]);

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

  // Aviso de captura obligatoria: sin selección, o al elegir una ficha que no puede comer
  const hasCaptures = captureOrigins.size > 0;
  const selectedHasCaptures = legalMoves.some((move) => move.captured.length > 0);
  const notice =
    !disabled && hasCaptures
      ? selection === null
        ? 'Captura obligatoria: elige una ficha resaltada para comer'
        : !selectedHasCaptures
          ? 'Esta ficha no puede capturar: elige una ficha resaltada'
          : null
      : null;

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
      const canCapture = captureOrigins.has(`${row},${col}`);
      return (
        <Square
          key={`${row}-${col}`}
          row={row}
          col={col}
          playable={isPlayableSquare(row, col)}
          piece={piece}
          selected={selected}
          isTarget={isTarget}
          canCapture={canCapture}
          onClick={() => handleSquareClick(row, col)}
          disabled={disabled}
        />
      );
    }),
  ).flat();

  return (
    <div className="board">
      <div className="board__grid" role="grid" aria-label="Tablero de damas">
        {squares}
      </div>
      {notice !== null && (
        <p className="board__notice" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}

export default Board;
