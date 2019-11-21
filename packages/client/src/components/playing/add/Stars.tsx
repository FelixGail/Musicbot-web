import { useContext, useState, useCallback } from "react";
import { LikedSongContext } from "../../../core/context/LikedSongsContext";
import React from "react";
import { Row } from "antd";
import { SongList } from "../snippets/songlist/SongList";
import { useResource } from "react-request-hook";
import api from "../../../core/api/model";
import { Song } from "../../../core/types";

const Stars = () => {
  const likedSongs = useContext(LikedSongContext);
  const [songs, setSongs] = useState(likedSongs.get().slice());
  const [, enqueue] = useResource(api.enqueue);

  const click = useCallback(
    (song: Song) => {
      enqueue(song);
      setSongs(songs.filter(item => item !== song));
    },
    [enqueue, setSongs, songs]
  );

  return (
    <div className="stars">
      <Row>
        <SongList header="Stars" items={songs} onClick={click} />
      </Row>
    </div>
  );
};

export default Stars;
