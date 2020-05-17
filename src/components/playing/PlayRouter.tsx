import React from "react";
import { ListenRouter } from "./listen/ListenRouter";
import { Route } from "react-router";
import SearchRouter from "./add/SearchRouter";
import { useResourceReload } from "../../core/hooks/usePlayerStateContext";
import api from "../../core/api/model";
import PlayerStateContext from "../../core/context/PlayerStateContext";
import { useMemo } from "react";

export const PlayRouter = () => {
  const playerState = useResourceReload(api.getPlayerState, undefined, 1000, false);
  const history = useResourceReload(api.getHistory, [], 1000, false);
  const queue = useResourceReload(api.getQueue, [], 1000, false);

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
