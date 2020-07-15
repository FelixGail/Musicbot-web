import { StarFilled } from "@ant-design/icons";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Song } from "../../../../core/types";
import { db } from "../../../../core/db/AppDB";
import { fromSong } from "../../../../core/db/LikedSong";

const SongItemAction = (props: { song: Song }) => {
  const [isLiked, setLiked] = useState<boolean>(false);
  useEffect(() => {
    db.songs.get(props.song.id).then(value => value && setLiked(true))
  }, [
    setLiked,
    props.song,
  ]);
  const style = useMemo(() => {
    if (isLiked) {
      return {
        color: "#00b300",
      };
    }
    return {
      color: "#e6e6e6",
    };
  }, [isLiked]);
  const click = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (isLiked) {
        db.songs.delete(props.song.id)
        setLiked(false);
      } else {
        fromSong(props.song).save()
        setLiked(true);
      }
      event.stopPropagation();
    },
    [isLiked, setLiked, props.song]
  );
  return <StarFilled onClick={click} style={style} />;
};

export default SongItemAction;
