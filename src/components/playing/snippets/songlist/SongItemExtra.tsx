import React, { Fragment } from "react";
import { Song, SongEntry } from "../../../../core/types";
import moment from "moment";
import { itemToSong } from "./SongListItem";
import { useMemo } from "react";
import styled from "styled-components";

const ItemExtraDiv = styled.div`
  text-align: center;
`;

function SongItemExtra<T extends Song | SongEntry>(props: { item: T }) {
  const inner = useMemo(() => {
    const song = itemToSong(props.item);
    const duration = moment.duration(song.duration, "s").format("h:mm:ss");
    if ((props.item as SongEntry).userName !== undefined) {
      return (
        <Fragment>
          {duration}
          <br />
          {(props.item as SongEntry).userName}
        </Fragment>
      );
    }
    return duration;
  }, [props.item]);

  return (
    <ItemExtraDiv>
      {inner}
    </ItemExtraDiv>
  );
}

export default SongItemExtra;
