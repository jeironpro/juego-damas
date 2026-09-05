import { useGame } from '@/hooks/useGame.js';
import GameScreen from '@/features/game/GameScreen.jsx';
import './App.css';

function App() {
  const { game, makeMove, undo } = useGame();
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Damas</h1>
      </header>
      <GameScreen game={game} onMove={makeMove} onUndo={undo} />
    </div>
  );
}

export default App;
