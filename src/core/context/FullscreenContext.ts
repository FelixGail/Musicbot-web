import { createContext } from "react";

export const FullscreenContext = createContext<(toggle?: boolean) => void>(
  () => {}
);
