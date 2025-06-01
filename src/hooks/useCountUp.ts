
import { useState, useEffect } from 'react';

export interface UseCountUpOptions {
  end: number;
  duration?: number;
  start?: number;
}

export const useCountUp = (options: UseCountUpOptions | number) => {
  const config = typeof options === 'number' ? { end: options } : options;
  const { end, duration = 2000, start = 0 } = config;
  
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * (end - start) + start));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
};
