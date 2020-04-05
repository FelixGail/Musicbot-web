import { Song } from "../../../core/types";
import { AlbumArt } from "../snippets/AlbumArt";
import React, { useMemo } from "react";
import ScreenNavigation from "../../util/ScreenNavigation";
import { useLocation } from "react-use";
import { useContext } from "react";
import { FullscreenContext } from "../../../core/context/FullscreenContext";
import { useHistory } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

const Current = (props: { song?: Song }) => {
  const location = useLocation();
  const toggleFullscreen = useContext(FullscreenContext);
  const history = useHistory();
  const left = `${location.pathname}/history`;
  const right = `${location.pathname}/queue`;
  const swipeHandler = useSwipeable({
    onSwipedLeft: () => history.push(right),
    onSwipedRight: () => history.push(left),
    preventDefaultTouchmoveEvent: true
  });
  const jsx = useMemo(
    () => (
      <div
        className="current full-width full-height vertically-centering centering"
        {...swipeHandler}
      >
        <AlbumArt song={props.song} />
        <ScreenNavigation left={left} right={right} center={toggleFullscreen} />
      </div>
    ),
    [props.song, left, right, swipeHandler, toggleFullscreen]
  );

  return jsx;
};

export default Current;
