import { useState } from 'react';

export function HowItWorks({ onClose }) {
    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: '#000000',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '2rem'
        }}>
            <h2 style={{ marginBottom: '2rem', textTransform: 'uppercase' }}>Rules of Life</h2>
            <ul style={{ lineHeight: '2rem', maxWidth: '600px', listStyle: 'none' }}>
                <li>1. <span style={{ textDecoration: 'underline' }}>Underpopulation</span>: Cell dies if neighbors &lt; 2.</li>
                <li>2. <span style={{ textDecoration: 'underline' }}>Survival</span>: Cell lives if neighbors are 2 or 3.</li>
                <li>3. <span style={{ textDecoration: 'underline' }}>Overpopulation</span>: Cell dies if neighbors &gt; 3.</li>
                <li>4. <span style={{ textDecoration: 'underline' }}>Reproduction</span>: Dead cell becomes alive if neighbors = 3.</li>
            </ul>
            <button onClick={onClose} style={{ marginTop: '3rem' }}>Got it</button>
        </div>
    );
}

export function StartScreen({ onStart }) {
    const [showRules, setShowRules] = useState(false);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: 5
        }}>
            {/* 
        This is a "text written in pixels" effect.
        We rely on the 'Press Start 2P' font which acts as pixels.
        To make it look like "Game of Life" cells, we could create a grid,
        but a large pixel font is the most robust aesthetic choice.
      */}
            <h1 style={{
                fontSize: '3rem',
                textAlign: 'center',
                marginBottom: '4rem',
                lineHeight: '1.5',
                textShadow: '4px 4px 0 #333'
            }}>
                CONWAY'S<br />GAME OF LIFE
            </h1>

            <div style={{ display: 'flex', gap: '2rem' }}>
                <button onClick={onStart}>Start Simulation</button>
                <button onClick={() => setShowRules(true)}>How this works</button>
            </div>

            {showRules && <HowItWorks onClose={() => setShowRules(false)} />}
        </div>
    );
}
