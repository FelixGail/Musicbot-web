import { List, Icon } from "antd";

import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback
} from "react";

import { AlbumArt } from "./AlbumArt";

import { Song } from "../../core/types";

import moment from "moment";

import { LikedSongContext } from "../../core/context/LikedSongsContext";
import { ListProps } from "antd/lib/list";

interface SongListProps {
  songs?: Song[];
  onClick: (song: Song) => void;
}

export const SongList = ({
  songs,
  onClick,
  ...props
}: SongListProps & ListProps<Song>) => {
  return (
    <List
      {...props}
      dataSource={songs}
      renderItem={item => (
        <List.Item
          key={item.title}
          onClick={() => onClick(item)}
          extra={<SongItemExtra song={item} />}
          actions={[<SongItemAction song={item} />]}
        >
          <List.Item.Meta
            title={item.title}
            description={item.description.substr(0, 50)}
            avatar={<AlbumArt song={item} />}
          />
        </List.Item>
      )}
    />
  );
};

const SongItemExtra = (props: { song: Song }) => (
  <div className="ant-list-item-meta-description">
    {moment.duration(props.song.duration, "s").format("h:mm:ss")}
  </div>
);

const SongItemAction = (props: { song: Song }) => {
  const likedSongs = useContext(LikedSongContext);
  const [isLiked, setLiked] = useState<boolean>(false);
  useEffect(() => {
    setLiked(likedSongs.contains(props.song));
  }, [setLiked, likedSongs, props.song]);
  const style = useMemo(() => {
    if (isLiked) {
      return {
        color: "green"
      };
    }
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

  return <Icon type="star" theme="filled" onClick={click} style={style} />;
};
