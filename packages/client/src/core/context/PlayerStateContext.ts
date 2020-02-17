import { PlayerState, SongEntry } from "../types";
import { createContext } from "react";

export interface IPlayerStateContext {
    playerState?: PlayerState
    playerStateTracker: Tracker

    queue?: SongEntry[]
    queueTracker: Tracker

    history?: SongEntry[]
    historyTracker: Tracker
}

export class Tracker {
    private watchers = 0;

    public addWatcher() {
        ++this.watchers;
    }

    public getWatchers(): number {
        return this.watchers;
    }

    public removeWatcher() {
        --this.watchers;
    }
}

const PlayerStateContext = createContext<IPlayerStateContext>({
    playerStateTracker: new Tracker(),
    queueTracker: new Tracker(),
    historyTracker: new Tracker()
})

export default PlayerStateContext;
