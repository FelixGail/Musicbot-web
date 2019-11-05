import React, { useEffect, useState, useMemo, useContext } from "react";
import { Card, Icon, Layout } from "antd";
import { useResource, RequestDispatcher, Resource } from "react-request-hook";
import api from "../../core/api/model";
import {
  PlayerStatus,
  Action,
  PlayerState,
  Permission
} from "../../core/types";
import { RouteComponentProps } from "react-router";
import { AlbumArt } from "./AlbumArt";
import { ConfigurationContext } from "../../core/context";
import moment from "moment";
import "moment-duration-format";

const { Meta } = Card;
const { Content, Footer } = Layout;

export const CurrentlyPlaying = (props: RouteComponentProps) => {
  const [playerState, getPlayerState] = useResource(api.getPlayerState);
  const [changedPlayerState, setPlayerState] = useResource(api.setPlayerState);
  const [reload, triggerReload] = useState(false);
  const { configuration } = useContext(ConfigurationContext);

  const songInfo = useMemo(() => {
    const songEntry = playerState.data && playerState.data.songEntry;
    const song = songEntry && songEntry.song;
    return {
      albumArt: <AlbumArt song={song} />,
      title: (song && song.title) || "",
      description: (song && song.description) || "",
      duration: moment
        .duration((song && song.duration) || 0, "s")
        .format("m:ss"),
      enqueuedBy: (songEntry && songEntry.userName) || "Suggested"
    };
  }, [playerState.data]);

  const actions = useMemo(() => {
    var actions = [
      <PlayPause
        status={playerState.data ? playerState.data.state : PlayerStatus.STOP}
        changePlayerState={setPlayerState}
      />
    ];
    if (
      configuration.permissions &&
      configuration.permissions.includes(Permission.SKIP)
    ) {
      actions.push(
        <Icon type="forward" onClick={() => setPlayerState(Action.SKIP)} />
      );
    }
    actions.push(
      <Icon type="search" onClick={() => props.history.push("listen/search")} />
    );
    return actions;
  }, [
    playerState.data,
    configuration.permissions,
    props.history,
    setPlayerState
  ]);

  useEffect(() => {
    getPlayerState();
    const ref = setTimeout(() => triggerReload(!reload), 1000);
    return () => clearTimeout(ref);
  }, [getPlayerState, reload, triggerReload, changedPlayerState.data]);

  return (
    <div className="currently-playing">
      <Layout>
        <Content className="centering vertically-centering">
          {songInfo.albumArt}
        </Content>
        <Footer>
          <Card className="spanning" actions={actions}>
            <Meta
              title={songInfo.title}
              description={`${songInfo.description.substr(0, 35)} - ${
                songInfo.enqueuedBy
              } - ${songInfo.duration}`}
            />
          </Card>
        </Footer>
      </Layout>
    </div>
  );
};

const PlayPause = (props: {
  status: PlayerStatus;
  changePlayerState: RequestDispatcher<
    (action: Action) => Resource<PlayerState>
  >;
}) => {
  switch (props.status) {
    case PlayerStatus.PLAY:
      return (
        <Icon
          type="pause"
          onClick={() => props.changePlayerState(Action.PAUSE)}
        />
      );
    default:
      return (
        <Icon
          type="caret-right"
          onClick={() => props.changePlayerState(Action.PLAY)}
        />
      );
  }
};
