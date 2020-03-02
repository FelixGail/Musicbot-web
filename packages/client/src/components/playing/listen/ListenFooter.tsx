import React, {
  FunctionComponent,
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
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
  showActions: boolean;
}

const ListenFooter: FunctionComponent<ListenFooterProps> = ({
  current,
  showActions
}) => {
  const [, setPlayerState] = useResource(api.setPlayerState);
  const { configuration } = useContext(ConfigurationContext);
  const history = useHistory();

  const currentRef = useRef(current);
  const [currentState, setCurrentState] = useState<PlayerState>(current);
  useEffect(() => {
    if (
      !(
        deepEqual(current.songEntry, currentRef.current.songEntry) &&
        deepEqual(current.state, currentRef.current.state)
      )
    ) {
      currentRef.current = current;
      setCurrentState(current);
    }
  }, [current, currentRef, setCurrentState]);

  const songInfo = useMemo(() => {
    const songEntry = currentState && currentState.songEntry;
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
  }, [currentState]);
  const actions = useMemo(() => {
    const actions = [];
    if (configuration.permissions) {
      if (configuration.permissions.includes(Permission.PAUSE)) {
        actions.push(
          <PlayPause
            status={currentState ? currentState.state : PlayerStatus.ERROR}
            changePlayerState={setPlayerState}
          />
        );
      }
      if (configuration.permissions.includes(Permission.SKIP)) {
        actions.push(
          <Icon type="forward" onClick={() => setPlayerState(Action.SKIP)} />
        );
      }
    }
    actions.push(<Icon type="search" onClick={() => history.push("/add")} />);
    return actions;
  }, [currentState, configuration.permissions, history, setPlayerState]);
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
  const jsx = useMemo(
    () => (
      <Layout.Footer>
        <Card className="spanning" actions={showActions ? actions : undefined}>
          <Card.Meta
            title={<Link to={searchLink}>{songInfo.title}</Link>}
            description={description}
          />
        </Card>
      </Layout.Footer>
    ),
    [actions, searchLink, songInfo.title, description, showActions]
  );
  return jsx;
};

export const PlayPause = ({
  status,
  changePlayerState
}: {
  status: PlayerStatus;
  changePlayerState: RequestDispatcher<
    (action: Action) => Resource<PlayerState>
  >;
}) => {
  const clickPause = useCallback(() => changePlayerState(Action.PAUSE), [
    changePlayerState
  ]);
  const clickPlay = useCallback(() => changePlayerState(Action.PLAY), [
    changePlayerState
  ]);
  return useMemo(() => {
    switch (status) {
      case PlayerStatus.PLAY:
        return <Icon type="pause" onClick={clickPause} />;
      default:
        return <Icon type="caret-right" onClick={clickPlay} />;
    }
  }, [status, clickPause, clickPlay]);
};

export default ListenFooter;
