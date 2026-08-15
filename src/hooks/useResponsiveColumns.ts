import { useEffect, useState } from 'react';

export function useResponsiveColumns(itemCount: number) {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  const byBreakpoint = width > 1000 ? 3 : width > 650 ? 2 : 1;
  const cols = Math.max(1, Math.min(itemCount, byBreakpoint));
  return cols;
}