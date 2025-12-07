import { useState, useEffect, useRef, useCallback } from 'react';

const createGrid = (width, height) => new Int8Array(width * height);

export const useGameOfLife = ({ width = 100, height = 100, speed = 100 } = {}) => {
    const [running, setRunning] = useState(false);
    const [generation, setGeneration] = useState(0);
    const [repaintTrigger, setRepaintTrigger] = useState(0);
    const gridRef = useRef(createGrid(width, height));
    const bufferRef = useRef(createGrid(width, height));
    const animationFrameId = useRef(null);
    const lastFrameTime = useRef(0);

    // Initialize random grid
    const randomize = useCallback(() => {
        const grid = gridRef.current;
        // Random usage density between 0.05 and 0.4 (5% to 40% fill)
        const density = 0.05 + Math.random() * 0.35;

        for (let i = 0; i < grid.length; i++) {
            grid[i] = Math.random() < density ? 1 : 0;
        }
        setGeneration(0);
        setRepaintTrigger(t => t + 1);
    }, [width, height]);

    // Clear grid
    const clear = useCallback(() => {
        gridRef.current.fill(0);
        setGeneration(0);
        setRepaintTrigger(t => t + 1);
        setRunning(false);
    }, []);

    // Compute next generation
    const computeNextGen = useCallback(() => {
        const grid = gridRef.current;
        const nextGrid = bufferRef.current;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = y * width + x;
                let neighbors = 0;

                // Check 8 neighbors
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;

                        // Wrap around (toroidal)
                        const ny = (y + dy + height) % height;
                        const nx = (x + dx + width) % width;

                        if (grid[ny * width + nx]) {
                            neighbors++;
                        }
                    }
                }

                const cell = grid[idx];
                if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
                    nextGrid[idx] = 0;
                } else if (cell === 0 && neighbors === 3) {
                    nextGrid[idx] = 1;
                } else {
                    nextGrid[idx] = cell;
                }
            }
        }

        // Swap buffers
        const temp = gridRef.current;
        gridRef.current = bufferRef.current;
        bufferRef.current = temp;

        setGeneration(g => g + 1);
    }, [width, height]);

    // Game loop
    const loop = useCallback((time) => {
        if (!running) return;

        if (time - lastFrameTime.current >= speed) {
            computeNextGen();
            lastFrameTime.current = time;
        }

        animationFrameId.current = requestAnimationFrame(loop);
    }, [running, speed, computeNextGen]);

    useEffect(() => {
        if (running) {
            lastFrameTime.current = performance.now();
            animationFrameId.current = requestAnimationFrame(loop);
        } else {
            cancelAnimationFrame(animationFrameId.current);
        }
        return () => cancelAnimationFrame(animationFrameId.current);
    }, [running, loop]);

    const toggleCell = useCallback((x, y) => {
        const idx = y * width + x;
        if (idx >= 0 && idx < gridRef.current.length) {
            gridRef.current[idx] = gridRef.current[idx] ? 0 : 1;
            setRepaintTrigger(t => t + 1);
        }
    }, [width]);

    return {
        gridRef,
        running,
        setRunning,
        generation,
        randomize,
        clear,
        computeNextGen,
        toggleCell,
        repaintTrigger
    };
};
