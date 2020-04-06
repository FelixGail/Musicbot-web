import React, { useCallback, useMemo, useRef, useContext } from "react";
import { Layout } from "antd";
import { Route } from "react-router";
import "moment-duration-format";
import Current from "./Current";
import History from "./History";
import Queue from "./Queue";
import ListenFooter from "./ListenFooter";
import { useToggle, useFullscreen } from "react-use";
import { FullscreenContext } from "../../../core/context/FullscreenContext";
import PlayerStateContext from "../../../core/context/PlayerStateContext";
import styled from "styled-components";

const StyledContent = styled(Layout.Content)`
  background-color: #272c35;
  -ms-overflow-style: none;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  position: relative;
`;

export const ListenRouter = () => {
  const { state: playerState } = useContext(PlayerStateContext);
  const [showFullscreen, toggleFullscreen] = useToggle(false);
  const ref = useRef(null);
  const isFullscreen = useFullscreen(ref, showFullscreen, {
    onClose: () => toggleFullscreen(false)
  });

  const renderCurrent = useCallback(
    () =>
      playerState && (
        <Current song={playerState.songEntry && playerState.songEntry.song} />
      ),
    [playerState]
  );

  const jsx = useMemo(
    () => (
        <FullscreenContext.Provider value={toggleFullscreen}>
          <div ref={ref}>
            <Layout>
              <StyledContent>
                <Route exact path="*/listen" render={renderCurrent} />
                <Route path="*/listen/history" component={History} />
                <Route path="*/listen/queue" component={Queue} />
              </StyledContent>
              {playerState && (
                <ListenFooter
                  current={playerState}
                  showActions={!isFullscreen}
                />
              )}
            </Layout>
          </div>
        </FullscreenContext.Provider>
    ),
    [renderCurrent, playerState, toggleFullscreen, ref, isFullscreen]
  );

  return jsx;
};
