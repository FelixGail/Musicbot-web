import React, {
  useCallback,
  useMemo,
  useRef,
  useContext,
  useState,
  useEffect,
  Fragment,
} from "react";
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
import { NavigationArrow } from "../snippets/NavigationArrow";
import { Flex } from "../../util/Flex";

export const ListenRouter = () => {
  const { state: playerState } = useContext(PlayerStateContext);
  const [height, setHeight] = useState<number>(window.innerHeight);
  const [showFullscreen, toggleFullscreen] = useToggle(false);
  const ref = useRef(null);
  const isFullscreen = useFullscreen(ref, showFullscreen, {
    onClose: () => toggleFullscreen(false),
  });

  const renderCurrent = useCallback(
    () =>
      playerState && (
        <Current song={playerState.songEntry && playerState.songEntry.song} />
      ),
    [playerState]
  );

  useEffect(() => {
    function updateSize() {
      setHeight(window.innerHeight);
    }
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [setHeight]);

  const jsx = useMemo(
    () => (
      <Fragment>
        <FullscreenContext.Provider
          value={{ toggle: toggleFullscreen, isFullscreen: isFullscreen }}
        >
          <Flex ref={ref}>
            <StyledLayout height={height}>
              <StyledContent>
                {!isFullscreen && (
                  <Fragment>
                    <NavigationArrow position="left" />
                    <NavigationArrow position="right" />
                  </Fragment>
                )}
                <Route exact path="*/listen" render={renderCurrent} />
                <Route path="*/listen/history" component={History} />
                <Route path="*/listen/queue" component={Queue} />
              </StyledContent>
              <ListenFooter showActions={!isFullscreen} />
            </StyledLayout>
          </Flex>
        </FullscreenContext.Provider>
      </Fragment>
    ),
    [renderCurrent, toggleFullscreen, ref, isFullscreen, height]
  );

  return jsx;
};
