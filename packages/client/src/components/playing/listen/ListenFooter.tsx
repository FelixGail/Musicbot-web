import React, { FunctionComponent, useContext, useMemo, useCallback, useEffect, useRef } from "react";
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
import deepEqual from "deep-equal";

export interface ListenFooterProps {
  current: PlayerState;
}

const ListenFooter: FunctionComponent<ListenFooterProps> = ({
  current
}) => {
  const [, setPlayerState] = useResource(api.setPlayerState);
  const { configuration } = useContext(ConfigurationContext);
  const history = useHistory();

  const currentRef = useRef(current);
  useEffect(() => {
    if(!(deepEqual(current.songEntry, currentRef.current.songEntry) && deepEqual(current.state, currentRef.current.state))) {
      currentRef.current = current;
    }
  }, [current, currentRef])

  const songInfo = useMemo(() => {
    const songEntry = currentRef.current.songEntry;
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
  }, [currentRef]);
  const actions = useMemo(() => {
    const actions = [];
    if(configuration.permissions) {
      if(configuration.permissions.includes(Permission.PAUSE)) {
        actions.push(<PlayPause status={currentRef.current.state} changePlayerState={setPlayerState} />)
      }
      if(configuration.permissions.includes(Permission.SKIP)
      ) {
        actions.push(
          <Icon type="forward" onClick={() => setPlayerState(Action.SKIP)} />
        );
      }
    }
    actions.push(<Icon type="search" onClick={() => history.push("/add")} />);
    return actions;
  }, [currentRef, configuration.permissions, history, setPlayerState]);
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
  const jsx = useMemo(() => (
    <Layout.Footer>
      <Card className="spanning" actions={actions}>
        <Card.Meta
          title={<Link to={searchLink}>{songInfo.title}</Link>}
          description={description}
        />
      </Card>
    </Layout.Footer>
  ), [actions, searchLink, songInfo.title, description])
  return jsx;
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
