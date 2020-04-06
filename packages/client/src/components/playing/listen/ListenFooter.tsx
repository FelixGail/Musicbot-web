import React, {
  FunctionComponent,
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import {
  ForwardOutlined,
  PauseCircleTwoTone,
  PlayCircleTwoTone
} from "@ant-design/icons";
import { Card, Layout } from "antd";
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
import deepEqual from "deep-equal";
import NavigationCard from "../snippets/FooterCard";
import styled from "styled-components";
import Permissional from "../../util/Permissional";

const Actions = styled.div`
  height: 55px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

interface ActionProps {
  size: number
}

const ActionDiv = styled.div`
  height: ${(props: ActionProps) => `${props.size}px`};
  width: ${(props: ActionProps) => `${props.size}px`};
  padding-top: 5px;
  padding-right: 5px;

  span {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 80%;
      height: 80%;
    }
  }
`;

const StyledCard = styled(Card)`
  .ant-card-body {
    padding-bottom: ${(props: {showActions: boolean}) => `${props.showActions? 5 : 24}px`};
  }
`

const ForwardIcon = styled(ForwardOutlined)`
  &:hover {
    color: #1890ff;
    background-color: #cccccc;
`;

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
    if (configuration.permissions) {
      return <Actions>
          <ActionDiv size={30}/>
          <Permissional permission={Permission.PAUSE}>
            <ActionDiv size={50}>
              <PlayPause
                status={currentState ? currentState.state : PlayerStatus.ERROR}
                changePlayerState={setPlayerState}
              />
            </ActionDiv>
          </Permissional>
          <ActionDiv size={30}>
            <Permissional permission={Permission.SKIP}>
              <ForwardIcon onClick={() => setPlayerState(Action.SKIP)} />
            </Permissional>
          </ActionDiv>
      </Actions>
    }
  }, [currentState, configuration.permissions, setPlayerState]);
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
        <StyledCard showActions={showActions}>
          <Card.Meta
            title={<Link to={searchLink}>{songInfo.title}</Link>}
            description={description}
          />
          {showActions && actions }
        </StyledCard>
        {showActions && <NavigationCard />}
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
        return <PauseCircleTwoTone onClick={clickPause} />;
      default:
        return <PlayCircleTwoTone onClick={clickPlay} />;
    }
  }, [status, clickPause, clickPlay]);
};

export default ListenFooter;
