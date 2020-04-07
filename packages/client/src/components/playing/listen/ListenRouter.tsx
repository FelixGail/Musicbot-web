import React, { useCallback, useMemo, useRef, useContext } from "react";
import { Route } from "react-router";
import "moment-duration-format";
import Current from "./Current";
import History from "./History";
import Queue from "./Queue";
import ListenFooter from "./ListenFooter";
import { useToggle, useFullscreen } from "react-use";
import { FullscreenContext } from "../../../core/context/FullscreenContext";
import PlayerStateContext from "../../../core/context/PlayerStateContext";
import { StyledLayout, StyledContent } from "../StyledLayout";

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
            <StyledLayout>
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
            </StyledLayout>
          </div>
        </FullscreenContext.Provider>
    ),
    [renderCurrent, playerState, toggleFullscreen, ref, isFullscreen]
  );

  return jsx;
};
