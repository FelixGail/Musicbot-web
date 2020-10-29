import { Song } from "../../../core/types";
import React, { Fragment, useMemo } from "react";
import ScreenNavigation from "../../util/ScreenNavigation";
import { useLocation } from "react-use";
import { useContext } from "react";
import { FullscreenContext } from "../../../core/context/FullscreenContext";
import { useHistory } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { ConfigurationContext } from "../../../core/context/Configuration";
import { BackgroundAlbumArt } from "../snippets/AlbumArt";
import SwipeDiv from "../../util/SwipeDiv";
import { StyledContent } from "../StyledLayout";
import { CarouselSlick } from "../snippets/CarouselSlick";

const Current = (props: { song?: Song }) => {
  const location = useLocation();
  const toggleFullscreen = useContext(FullscreenContext);
  const history = useHistory();
  const left = `${location.pathname}/history`;
  const right = `${location.pathname}/queue`;
  const swipeHandler = useSwipeable({
    onSwipedLeft: () => history.push(right),
    onSwipedRight: () => history.push(left),
    preventDefaultTouchmoveEvent: true,
  });
  const { configuration } = useContext(ConfigurationContext);

  const jsx = useMemo(
    () => (
      <Fragment>
          <SwipeDiv {...swipeHandler}>
            <BackgroundAlbumArt song={props.song} config={configuration} />
            <ScreenNavigation left={left} right={right} center={toggleFullscreen} />
          </SwipeDiv>
          <CarouselSlick span={8} offset={8}/>
      </Fragment>
    ),
    [props.song, left, right, swipeHandler, toggleFullscreen, configuration]
  );

  return jsx;
};

export default Current;
