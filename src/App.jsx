import { useState, useEffect } from 'react'
import { useGameOfLife } from './hooks/useGameOfLife'
import GameCanvas from './components/GameCanvas'
import { StartScreen } from './components/StartScreen'

function App() {
    const [gameState, setGameState] = useState('start')
    const width = 100;
    const height = 60;

    const {
        gridRef,
        running,
        setRunning,
        generation,
        randomize,
        clear,
        toggleCell,
        repaintTrigger
    } = useGameOfLife({ width, height, speed: 100 });

    useEffect(() => {
        if (gameState === 'playing') {
            randomize();
        } else {
            setRunning(false);
        }
    }, [gameState, randomize, setRunning]);

    return (
        <div className="app-container" style={{ width: '100vw', height: '100vh', position: 'relative' }}>

            {gameState === 'start' && (
                <StartScreen onStart={() => setGameState('playing')} />
            )}

            {gameState === 'playing' && (
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{ marginBottom: '1rem', textTransform: 'uppercase' }}>
                        Generation: {generation}
                    </div>

                    <GameCanvas
                        gridRef={gridRef}
                        width={width}
                        height={height}
                        onToggle={toggleCell}
                        generation={generation}
                        repaintTrigger={repaintTrigger}
                    />

                    <div className="controls" style={{
                        marginTop: '2rem',
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        <button onClick={() => setRunning(!running)}>
                            {running ? 'Pause' : 'Start'}
                        </button>
                        <button onClick={randomize}>Randomize</button>
                        <button onClick={clear}>Clear</button>
                        <button onClick={() => setGameState('start')}>Back</button>
                    </div>


                </div>
            )}
        </div>
    )
}

export default App
