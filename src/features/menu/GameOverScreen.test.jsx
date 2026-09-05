import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameOverScreen from './GameOverScreen.jsx';

describe('GameOverScreen', () => {
  it('shows the winner title and runs the actions', async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();
    const onMenu = vi.fn();
    render(<GameOverScreen title="¡Ganaste!" onRestart={onRestart} onMenu={onMenu} />);
    expect(screen.getByRole('dialog')).toHaveTextContent('¡Ganaste!');
    await user.click(screen.getByRole('button', { name: /jugar de nuevo/i }));
    expect(onRestart).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: /volver al menú/i }));
    expect(onMenu).toHaveBeenCalledTimes(1);
  });
});
