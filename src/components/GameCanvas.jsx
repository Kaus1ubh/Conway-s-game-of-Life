import { useRef, useEffect } from 'react';

export default function GameCanvas({
    gridRef,
    width,
    height,
    cellSize = 10,
    onToggle,
    generation,
    repaintTrigger
}) {
    const canvasRef = useRef(null);

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const grid = gridRef.current;

        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#FFFFFF';

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (grid[y * width + x]) {
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
    };

    useEffect(() => {
        draw();
    }, [generation, repaintTrigger, width, height, cellSize, gridRef]); // Added repaintTrigger

    const handleClick = (e) => {
        if (!onToggle) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        onToggle(x, y);
        draw(); // Force immediate redraw on interaction
    };

    return (
        <canvas
            ref={canvasRef}
            width={width * cellSize}
            height={height * cellSize}
            onClick={handleClick}
            style={{
                border: '4px solid #FFFFFF',
                imageRendering: 'pixelated',
                cursor: 'crosshair',
                maxWidth: '100%',
                maxHeight: '80vh',
                aspectRatio: `${width}/${height}`
            }}
        />
    );
}
