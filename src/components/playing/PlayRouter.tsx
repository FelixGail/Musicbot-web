import React from "react";
import { ListenRouter } from "./listen/ListenRouter";
import { Route } from "react-router";
import SearchRouter from "./add/SearchRouter";
import Operations from "../../core/rest/operations";
import PlayerStateContext from "../../core/context/PlayerStateContext";
import { useMemo } from "react";
import { useResourceReload } from "../../core/hooks/resourceReloadHook";

export const PlayRouter = () => {
  const playerState = useResourceReload(Operations.getPlayerState, undefined, 1000, false);
  const history = useResourceReload(Operations.getHistory, [], 1000, false);
  const queue = useResourceReload(Operations.getQueue, [], 1000, false);

  const jsx = useMemo(
    () => (
      <PlayerStateContext.Provider
        value={{ state: playerState, history: history, queue: queue }}
      >
        <Route path="*/listen" component={ListenRouter} />
        <Route path="*/add" component={SearchRouter} />
      </PlayerStateContext.Provider>
    ),
    [playerState, history, queue]
  );

  return jsx;
};
