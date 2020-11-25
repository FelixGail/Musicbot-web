import { createContext } from "react";

export const FullscreenContext = createContext<{
  toggle: (toggle?: boolean) => void;
  isFullscreen: boolean;
}>({
  toggle: () => {},
  isFullscreen: false,
});
