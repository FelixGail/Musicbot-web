import React, { FunctionComponent, useContext, useMemo, useCallback } from "react";
import { Card, Layout, Icon } from "antd";
import { Link } from "react-router-dom";
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
import { useHistory } from "react-router";

export interface ListenFooterProps {
  current: PlayerState;
}

const ListenFooter: FunctionComponent<ListenFooterProps> = ({
  current
}) => {
  const [, setPlayerState] = useResource(api.setPlayerState);
  const { configuration } = useContext(ConfigurationContext);
  const history = useHistory();

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

export const PlayPause = ({status, changePlayerState}: {
  status: PlayerStatus;
  changePlayerState: RequestDispatcher<
    (action: Action) => Resource<PlayerState>
  >;
}) => {
  const clickPause = useCallback(() => changePlayerState(Action.PAUSE), [changePlayerState]);
  const clickPlay = useCallback(() => changePlayerState(Action.PLAY), [changePlayerState]);
  return useMemo(() => {
    switch (status) {
      case PlayerStatus.PLAY:
        return (
          <Icon
            type="pause"
            onClick={clickPause}
          />
        );
      default:
        return (
          <Icon
            type="caret-right"
            onClick={clickPlay}
          />
        );
    }
  }, [status, clickPause, clickPlay]);
};

export default ListenFooter;
