import React, { FunctionComponent, useContext, useMemo } from "react";
import { Card, Layout, Icon } from "antd";
import { Link, RouteComponentProps } from "react-router-dom";
import { useResource, RequestDispatcher, Resource } from "react-request-hook";
import api from "../../../core/api/model";
import { ConfigurationContext } from "../../../core/context/Configuration";
import {
  Permission,
  Action,
  PlayerStatus,
  PlayerState
} from "../../../core/types";
import moment from "moment";

export interface ListenFooterProps extends RouteComponentProps {
  current: PlayerState;
}

const ListenFooter: FunctionComponent<ListenFooterProps> = ({
  current,
  history
}) => {
  const [, setPlayerState] = useResource(api.setPlayerState);
  const { configuration } = useContext(ConfigurationContext);
  const songInfo = useMemo(() => {
    const songEntry = current.songEntry;
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
  }, [current]);
  const actions = useMemo(() => {
    var actions = [
      <PlayPause status={current.state} changePlayerState={setPlayerState} />
    ];
    if (
      configuration.permissions &&
      configuration.permissions.includes(Permission.SKIP)
    ) {
      actions.push(
        <Icon type="forward" onClick={() => setPlayerState(Action.SKIP)} />
      );
    }
    actions.push(<Icon type="search" onClick={() => history.push("/add")} />);
    return actions;
  }, [current, configuration.permissions, history, setPlayerState]);
  const searchLink = useMemo(() => `/add/search?${encodeURI(songInfo.title)}`, [
    songInfo.title
  ]);
  const description = useMemo(
    () =>
      `${songInfo.description.substr(0, 35)} - ${songInfo.enqueuedBy} - ${
        songInfo.duration
      }`,
    [songInfo]
  );
  return (
    <Layout.Footer>
      <Card className="spanning" actions={actions}>
        <Card.Meta
          title={<Link to={searchLink}>{songInfo.title}</Link>}
          description={description}
        />
      </Card>
    </Layout.Footer>
  );
};

export const PlayPause = (props: {
  status: PlayerStatus;
  changePlayerState: RequestDispatcher<
    (action: Action) => Resource<PlayerState>
  >;
}) => {
  return useMemo(() => {
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
  }, [props.status, props.changePlayerState]);
};

export default ListenFooter;
