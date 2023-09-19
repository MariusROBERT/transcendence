import { useEffect } from 'react';

export interface Viewport {
  isLandscape: boolean;
  height: number;
  width: number;
}

export function useEffectViewport(
  viewport: Viewport,
  SIZE: number,
  setViewport: (it: Viewport) => void,
) {
  useEffect(() => {
    const updateDimension = () => {
      setViewport({
        isLandscape: window.innerWidth >= SIZE * 2 && window.innerWidth / window.innerHeight > 0.9,
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    window.addEventListener('resize', updateDimension);


        return(() => {
            window.removeEventListener('resize', updateDimension);
        })
    }, [viewport, SIZE, setViewport])
}


