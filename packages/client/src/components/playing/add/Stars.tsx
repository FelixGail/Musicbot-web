import { useContext, useState, useCallback } from "react";
import { LikedSongContext } from "../../../core/context/LikedSongsContext";
import React from "react";
import { SongList } from "../snippets/songlist/SongList";
import api from "../../../core/api/model";
import { Song, Permission } from "../../../core/types";
import useResourceWithPermission from "../../../core/api/permissionWrapperHook";

const Stars = () => {
  const likedSongs = useContext(LikedSongContext);
  const [songs] = useState(likedSongs.get().slice());
  const [, enqueue] = useResourceWithPermission(
    api.enqueue,
    Permission.ENQUEUE
  );

  const click = useCallback(
    (song: Song) => {
      return enqueue([], song) && true;
    },
    [enqueue]
  );

  return (
    <SongList header="Stars" items={songs} onClick={click} />
  );
};

export default Stars;
