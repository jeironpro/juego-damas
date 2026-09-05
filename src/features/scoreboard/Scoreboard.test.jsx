import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PLAYER_1, PLAYER_2 } from '@/features/game/constants.js';
import Scoreboard from './Scoreboard.jsx';

describe('Scoreboard', () => {
  it('muestra los nombres, los contadores y el marcador VS', () => {
    render(
      <Scoreboard
        player1Name="TÚ"
        player2Name="BOT"
        player1Count={12}
        player2Count={9}
        turn={PLAYER_1}
      />,
    );
    expect(screen.getByText('TÚ')).toBeInTheDocument();
    expect(screen.getByText('BOT')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('VS')).toBeInTheDocument();
  });

  it('muestra el badge de dificultad cuando se indica', () => {
    render(
      <Scoreboard
        player1Name="TÚ"
        player2Name="BOT"
        player1Count={12}
        player2Count={12}
        turn={PLAYER_1}
        badge="Difícil"
      />,
    );
    expect(screen.getByText('Difícil')).toBeInTheDocument();
  });

  it('resalta al jugador en turno', () => {
    const { container } = render(
      <Scoreboard
        player1Name="TÚ"
        player2Name="BOT"
        player1Count={12}
        player2Count={9}
        turn={PLAYER_2}
      />,
    );
    const activeCount = container.querySelector('.scoreboard__count--active');
    expect(activeCount).toHaveTextContent('9');
    const activeName = container.querySelector('.scoreboard__name--active');
    expect(activeName).toHaveTextContent('BOT');
  });
});
