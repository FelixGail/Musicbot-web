import { Song } from "../../../core/types";
import { AlbumArt } from "../snippets/AlbumArt";
import React from "react";
import ScreenNavigation from "../../util/ScreenNavigation";
import { RouteComponentProps } from "react-router";

const Current = (props: { song?: Song } & RouteComponentProps) => {
  return (
    <div className="current full-width full-height vertically-centering centering">
      <AlbumArt song={props.song} />
      <ScreenNavigation
        left={`${props.location.pathname}/history`}
        right={`${props.location.pathname}/queue`}
      />
    </div>
  );
};

export default Current;
