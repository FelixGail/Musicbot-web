import React from "react";
import { Song, SongEntry } from "../../../../core/types";
import moment from "moment";
import { itemToSong } from "./SongListItem";
import { useMemo } from "react";

function SongItemExtra<T extends Song | SongEntry>(props: { item: T }) {
  const inner = useMemo(() => {
    const song = itemToSong(props.item);
    const duration = moment.duration(song.duration, "s").format("h:mm:ss");
    if ((props.item as SongEntry).userName !== undefined) {
      return (
        <div>
          {duration}
          <br />
          {(props.item as SongEntry).userName}
        </div>
      );
    }
    return duration;
  }, [props.item]);

  return (
    <div className="ant-list-item-meta-description text-center list-item-extra">
      {inner}
    </div>
  );
}

export default SongItemExtra;
