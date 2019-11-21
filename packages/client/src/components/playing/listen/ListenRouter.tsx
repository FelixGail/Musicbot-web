import React, { useMemo, useContext } from "react";
import { Card, Icon, Layout } from "antd";
import { useResource, RequestDispatcher, Resource } from "react-request-hook";
import api from "../../../core/api/model";
import {
  PlayerStatus,
  Action,
  PlayerState,
  Permission
} from "../../../core/types";
import { RouteComponentProps, Route } from "react-router";
import { ConfigurationContext } from "../../../core/context/Configuration";
import moment from "moment";
import "moment-duration-format";
import { Link } from "react-router-dom";
import Current from "./Current";
import History from "./History";
import Queue from "./Queue";
import useReload from "../../../core/reloadHook";

const { Meta } = Card;
const { Content, Footer } = Layout;

export const ListenRouter = (props: RouteComponentProps) => {
  const [playerState, getPlayerState] = useResource(api.getPlayerState);
  const [, setPlayerState] = useResource(api.setPlayerState);
  const { configuration } = useContext(ConfigurationContext);

  useReload(getPlayerState);

  const songInfo = useMemo(() => {
    const songEntry = playerState.data && playerState.data.songEntry;
    const song = songEntry && songEntry.song;
    return {
      song: song,
      title: (song && song.title) || "",
      description: (song && song.description) || "",
      duration: moment
        .duration((song && song.duration) || 0, "s")
        .format("mm:ss"),
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
      <Icon type="search" onClick={() => props.history.push("/add")} />
    );
    return actions;
  }, [
    playerState.data,
    configuration.permissions,
    props.history,
    setPlayerState
  ]);

  return (
    <div className="currently-playing">
      <Layout>
        <Content>
          <Route
            exact
            path="*/listen"
            render={props => <Current song={songInfo.song} {...props} />}
          />
          <Route path="*/listen/history" component={History} />
          <Route path="*/listen/queue" component={Queue} />
        </Content>
        <Footer>
          <Card className="spanning" actions={actions}>
            <Meta
              title={
                <Link to={`listen/add/search?${encodeURI(songInfo.title)}`}>
                  {songInfo.title}
                </Link>
              }
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
