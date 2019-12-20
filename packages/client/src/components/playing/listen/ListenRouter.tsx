import React, { useEffect, useCallback } from "react";
import { Layout } from "antd";
import api from "../../../core/api/model";
import { PlayerStatus, playerStateEquals } from "../../../core/types";
import { RouteComponentProps, Route } from "react-router";
import "moment-duration-format";
import Current from "./Current";
import History from "./History";
import Queue from "./Queue";
import useEquallingReload from "../../../core/hooks/useEquallingReload";
import ListenFooter from "./ListenFooter";
import { useLogger } from "react-use";

export const ListenRouter = (props: RouteComponentProps) => {
  useLogger("ListenRouter");
  const current = useEquallingReload(api.getPlayerState, playerStateEquals, {
    state: PlayerStatus.STOP
  });
  useEffect(() => console.log(current), [current]);

  const renderCurrent = useCallback(
    (props: RouteComponentProps) => (
      <Current song={current.songEntry && current.songEntry.song} {...props} />
    ),
    [current.songEntry]
  );

  return (
    <div className="currently-playing">
      <Layout>
        <Layout.Content>
          <Route exact path="*/listen" render={renderCurrent} />
          <Route path="*/listen/history" component={History} />
          <Route path="*/listen/queue" component={Queue} />
        </Layout.Content>
        <ListenFooter current={current} {...props} />
      </Layout>
    </div>
  );
};
