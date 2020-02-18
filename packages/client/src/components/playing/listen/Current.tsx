import { Song } from "../../../core/types";
import { AlbumArt } from "../snippets/AlbumArt";
import React, { useMemo } from "react";
import ScreenNavigation from "../../util/ScreenNavigation";
import { useLocation } from "react-use";

const Current = (props: { song?: Song }) => {
  const location = useLocation()

  const jsx = useMemo(() => (
    <div className="current full-width full-height vertically-centering centering">
      <AlbumArt song={props.song} />
      <ScreenNavigation
        left={`${location.pathname}/history`}
        right={`${location.pathname}/queue`}
      />
    </div>), [props.song, location.pathname])

    return jsx;
};

export default Current;
