import { PlayerState, SongEntry } from '../types';
import { createContext } from 'react';

export interface CombinedPlayerState {
  state?: PlayerState;
  queue: SongEntry[];
  history: SongEntry[];
  setPlayerState: (s: PlayerState) => void;
  setQueue: (q: SongEntry[]) => void;
  setHistory: (h: SongEntry[]) => void;
}

const PlayerStateContext = createContext<CombinedPlayerState>({
  state: undefined,
  queue: [],
  history: [],
  setPlayerState: () => {},
  setHistory: () => {},
  setQueue: () => {},
});

export default PlayerStateContext;
