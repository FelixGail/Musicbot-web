import { createContext } from 'react';

export const FullscreenContext = createContext<{
  toggle: (toggle?: boolean) => void;
  isFullscreen: boolean;
}>({
  toggle: () => console.error('FullscreenContext has not been initialized correctly'),
  isFullscreen: false,
});
