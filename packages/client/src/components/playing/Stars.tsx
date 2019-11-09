import { useContext, useState, useCallback } from "react";
import { LikedSongContext } from "../../core/context/LikedSongsContext";
import React from "react";
import { Row } from "antd";
import { SongList } from "./SongList";
import { useResource } from "react-request-hook";
import api from "../../core/api/model";
import { Song } from "../../core/types";

const Stars = () => {
  const likedSongs = useContext(LikedSongContext);
  const [songs, setSongs] = useState(likedSongs.get().slice());
  const [, enqueue] = useResource(api.enqueue);

  const click = useCallback(
    (song: Song) => {
      enqueue(song, song.provider);
      setSongs(songs.filter(item => item !== song));
    },
    [enqueue, setSongs, songs]
  );

  return (
    <div className="stars">
      <Row>
        <SongList header="Stars" songs={songs} onClick={click} />
      </Row>
    </div>
  );
};

export default Stars;
