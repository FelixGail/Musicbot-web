import React, { useCallback, useMemo } from "react";
import { Layout } from "antd";
import { Route } from "react-router";
import "moment-duration-format";
import Current from "./Current";
import History from "./History";
import Queue from "./Queue";
import ListenFooter from "./ListenFooter";
import { useResourceReload } from "../../../core/hooks/usePlayerStateContext";
import api from "../../../core/api/model";

export const ListenRouter = () => {
  const playerState = useResourceReload(api.getPlayerState, undefined)

  const renderCurrent = useCallback(
    () => (
     playerState && <Current song={playerState.songEntry && playerState.songEntry.song}/>
    ),
    [playerState]
  );

  const jsx = useMemo(() => (
  <div className="currently-playing">
    <Layout>
      <Layout.Content>
        <Route exact path="*/listen" render={renderCurrent} />
        <Route path="*/listen/history" component={History} />
        <Route path="*/listen/queue" component={Queue} />
      </Layout.Content>
      {playerState && <ListenFooter current={playerState}/>}
    </Layout>
  </div>), [renderCurrent, playerState])

  return jsx;
};
