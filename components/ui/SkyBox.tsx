import React, { useEffect, useRef } from 'react';

const SkyBox: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let stars: { x: number; y: number; z: number; size: number }[] = [];
        const numStars = 200;
        const speed = 0.5;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width - canvas.width / 2,
                    y: Math.random() * canvas.height - canvas.height / 2,
                    z: Math.random() * canvas.width,
                    size: Math.random() * 2,
                });
            }
        };

        const draw = () => {
            ctx.fillStyle = '#020617'; // slate-950
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            stars.forEach((star) => {
                star.z -= speed;
                if (star.z <= 0) {
                    star.z = canvas.width;
                    star.x = Math.random() * canvas.width - canvas.width / 2;
                    star.y = Math.random() * canvas.height - canvas.height / 2;
                }

                const x = (star.x / star.z) * 100 + cx;
                const y = (star.y / star.z) * 100 + cy;
                const size = (1 - star.z / canvas.width) * star.size * 2;

                if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
                    const alpha = 1 - star.z / canvas.width;
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Add nebula/gradient overlay
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width);
            gradient.addColorStop(0, 'rgba(79, 70, 229, 0.05)'); // Indigo glow center
            gradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.0)');
            gradient.addColorStop(1, 'rgba(2, 6, 23, 0.8)'); // Dark edges

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />;
};

export default SkyBox;
