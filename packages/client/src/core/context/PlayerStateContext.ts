import { PlayerState, SongEntry } from "../types";
import { createContext } from "react";

export interface CombinedPlayerState {
  state?: PlayerState;
  queue: SongEntry[];
  history: SongEntry[];
}

const PlayerStateContext = createContext<CombinedPlayerState>({
  state: undefined,
  queue: [],
  history: [],
});

export default PlayerStateContext;
