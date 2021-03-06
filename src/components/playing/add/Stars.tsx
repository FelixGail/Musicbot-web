import { useState, useCallback, useEffect } from "react";
import React from "react";
import { SongList } from "../../util/list/songlist/SongList";
import Operations from "../../../core/rest/operations";
import { Song, Permission } from "../../../core/types";
import useResourceWithPermission from "../../../core/hooks/permissionWrapperHook";
import { db } from "../../../core/db/AppDB";
import { LikedSong } from "../../../core/db/LikedSong";

const Stars = () => {
  const [songs, setSongs] = useState<LikedSong[]>([]);

  useEffect(() => {
    db.songs
      .orderBy("title")
      .toArray()
      .then(async (songs) => {
        await Promise.all(
          songs.map(async (song) => await song.loadNavigationProperties())
        );
        setSongs(songs);
      });
  }, [setSongs]);

  const [, enqueue] = useResourceWithPermission(
    Operations.enqueue,
    Permission.ENQUEUE
  );

  const click = useCallback(
    (song: Song) => {
      return enqueue([], song) && true;
    },
    [enqueue]
  );

  return <SongList header="Stars" items={songs} onClick={click} />;
};

export default Stars;
