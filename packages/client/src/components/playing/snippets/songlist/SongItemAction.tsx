import { StarFilled } from "@ant-design/icons";
import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback
} from "react";
import { Song } from "../../../../core/types";
import { LikedSongContext } from "../../../../core/context/LikedSongsContext";

const SongItemAction = (props: { song: Song }) => {
  const likedSongs = useContext(LikedSongContext);
  const [isLiked, setLiked] = useState<boolean>(false);
  useEffect(() => {
    setLiked(likedSongs.contains(props.song));
  }, [
    setLiked,
    likedSongs,
    likedSongs.songs,
    likedSongs.songs.length,
    props.song
  ]);
  const style = useMemo(() => {
    if (isLiked) {
      return {
        color: "#00b300"
      };
    }
    return {
      color: "#e6e6e6"
    };
  }, [isLiked]);
  const click = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (isLiked) {
        likedSongs.removeSong(props.song);
        setLiked(false);
      } else {
        likedSongs.addSong(props.song);
        setLiked(true);
      }
      event.stopPropagation();
    },
    [likedSongs, isLiked, setLiked, props.song]
  );
  return <StarFilled onClick={click} style={style} />;
};

export default SongItemAction;
