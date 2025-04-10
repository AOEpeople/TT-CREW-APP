'use client';

import { useEffect, useState, useRef } from 'react';

interface Ball {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
}

export default function PingPongBalls() {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  
  // Use a ref to store the last animation timestamp
  const lastTimeRef = useRef<number | null>(null);

  // Initialize balls
  useEffect(() => {
    const initialBalls: Ball[] = [];
    const numBalls = 7; // Number of balls to create

    for (let i = 0; i < numBalls; i++) {
      initialBalls.push({
        id: i,
        x: Math.random() * windowSize.width,
        y: Math.random() * windowSize.height,
        size: Math.random() * 20 + 10, // Random size between 10 and 30
        speedX: (Math.random() - 0.5) * 5, // Reduced speed multiplier from 2 to 0.5
        speedY: (Math.random() - 0.5) * 5, // Reduced speed multiplier from 2 to 0.5
        rotation: Math.random() * 360, // Random initial rotation
        rotationSpeed: (Math.random() - 0.5) * 1, // Reduced rotation speed from 5 to 1
      });
    }

    setBalls(initialBalls);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animate balls with time-based animation
  useEffect(() => {
    if (balls.length === 0) return;

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);

    function animate(timestamp: number) {
      // Initialize lastTime if it's the first frame
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
        requestAnimationFrame(animate);
        return;
      }

      // Calculate time elapsed since last frame in seconds
      const deltaTime = (timestamp - lastTimeRef.current) / 16.67; // Normalize to ~60fps
      lastTimeRef.current = timestamp;

      setBalls((prevBalls) => {
        return prevBalls.map((ball) => {
          // Update position with deltaTime to ensure consistent speed
          let newX = ball.x + ball.speedX * deltaTime;
          let newY = ball.y + ball.speedY * deltaTime;
          let newSpeedX = ball.speedX;
          let newSpeedY = ball.speedY;

          // Bounce off walls
          if (newX <= 0 || newX >= windowSize.width) {
            newSpeedX = -ball.speedX;
            newX = newX <= 0 ? 0 : windowSize.width;
          }

          if (newY <= 0 || newY >= windowSize.height) {
            newSpeedY = -ball.speedY;
            newY = newY <= 0 ? 0 : windowSize.height;
          }

          // Update rotation with deltaTime
          const newRotation = ball.rotation + ball.rotationSpeed * deltaTime;

          return {
            ...ball,
            x: newX,
            y: newY,
            speedX: newSpeedX,
            speedY: newSpeedY,
            rotation: newRotation,
          };
        });
      });

      requestAnimationFrame(animate);
    }
  }, [balls, windowSize]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {balls.map((ball) => (
        <div
          key={ball.id}
          className="absolute rounded-full bg-white opacity-70"
          style={{
            left: `${ball.x}px`,
            top: `${ball.y}px`,
            width: `${ball.size}px`,
            height: `${ball.size}px`,
            transform: `rotate(${ball.rotation}deg)`,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
          }}
        >
          
        </div>
      ))}
    </div>
  );
} 