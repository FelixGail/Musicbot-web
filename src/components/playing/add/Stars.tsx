import { useState, useCallback, useEffect } from "react";
import React from "react";
import { SongList } from "../snippets/songlist/SongList";
import api from "../../../core/api/model";
import { Song, Permission } from "../../../core/types";
import useResourceWithPermission from "../../../core/api/permissionWrapperHook";
import { db } from "../../../core/db/AppDB";
import { LikedSong } from "../../../core/db/LikedSong";

const Stars = () => {
  const [songs, setSongs] = useState<LikedSong[]>([]);

  useEffect(() => {
    db.songs.orderBy('title').toArray().then(songs => {
      songs.forEach(song => song.loadNavigationProperties())
      setSongs(songs)
    })
  },[setSongs])

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
