import { useState, useEffect } from 'react';

export interface UseCountUpOptions {
  end: number;
  duration?: number;
  start?: number;
  loop?: boolean;
}

export const useCountUp = (options: UseCountUpOptions | number) => {
  const config = typeof options === 'number' ? { end: options } : options;
  const { end, duration = 2000, start = 0, loop = false } = config;
  
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number;
    let frameId: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * (end - start) + start));
      
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else if (loop) {
        setTimeout(() => {
          setCount(start);
          startTime = undefined as any;
          frameId = requestAnimationFrame(animate);
        }, 500);
      }
    };
    
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [end, duration, start, loop]);

  return count;
};
