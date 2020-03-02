import { Song } from "../../../core/types";
import { AlbumArt } from "../snippets/AlbumArt";
import React, { useMemo } from "react";
import ScreenNavigation from "../../util/ScreenNavigation";
import { useLocation } from "react-use";
import { useContext } from "react";
import { FullscreenContext } from "../../../core/context/FullscreenContext";

const Current = (props: { song?: Song }) => {
  const location = useLocation();
  const toggleFullscreen = useContext(FullscreenContext);
  const jsx = useMemo(
    () => (
      <div className="current full-width full-height vertically-centering centering">
        <AlbumArt song={props.song} />
        <ScreenNavigation
          left={`${location.pathname}/history`}
          right={`${location.pathname}/queue`}
          center={toggleFullscreen}
        />
      </div>
    ),
    [props.song, location.pathname, toggleFullscreen]
  );

  return jsx;
};

export default Current;
