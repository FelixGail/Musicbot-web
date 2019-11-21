import React from "react";
import { Song } from "../../../../core/types";
import moment from "moment";

const SongItemExtra = (props: { song: Song }) => (
  <div className="ant-list-item-meta-description">
    {moment.duration(props.song.duration, "s").format("h:mm:ss")}
  </div>
);

export default SongItemExtra;
