import React, {useRef, useEffect} from 'react'

const MatrixBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (!canvas) return;

        // Setting canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Matrix characters
        const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array(columns).fill(1);

        // Animation
        const animate = () => {
            // Semi-Transparent black to create trail effect
            ctx.fillStyle =  'rgba(10, 10, 10, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff41';
            ctx.font = `${fontSize}px 'Courier New', monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                ctx.fillText(text, x, y);

                // reset drop when it reaches bottom with random delay
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
            requestAnimationFrame(animate);
        };

        // animate();
        requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

  return (
    <canvas 
        className="matrix-background fixed inset-0 pointer-events-none z-0"
        ref={canvasRef}    
    ></canvas>
  )
}

export default MatrixBackground