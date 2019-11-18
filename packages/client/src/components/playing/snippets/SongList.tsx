import { List, Icon } from "antd";

import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback
} from "react";

import { AlbumArt } from "./AlbumArt";

import { Song, SongEntry } from "../../../core/types";

import moment from "moment";

import { LikedSongContext } from "../../../core/context/LikedSongsContext";
import { ListProps, ListItemProps } from "antd/lib/list";
import { useResource } from "react-request-hook";
import api from "../../../core/api/model";

type SongListAdditional<T> = ((item: T) => JSX.Element | null)[];

interface SongListProps<T extends Song | SongEntry> {
  items?: T[];
  onClick: (item: T) => void;
  additional?: SongListAdditional<T>;
}

interface SongListItem<T extends Song | SongEntry> {
  song: Song;
  queue: SongEntry[];
  item: T;
  handleClick: (item: T) => void;
  additional?: SongListAdditional<T>;
}

export const SongList = ({
  items,
  additional,
  onClick,
  ...props
}: SongListProps<Song> & ListProps<Song>) => {
  const [{ data }, getQueue] = useResource(api.getQueue);
  useEffect(() => {
    getQueue();
  }, [getQueue]);

  return (
    <List
      className="songlist"
      {...props}
      dataSource={items}
      renderItem={item => (
        <SongListItem
          song={item}
          item={item}
          handleClick={onClick}
          queue={data || []}
          additional={additional}
        />
      )}
    />
  );
};

export const SongEntryList = ({
  items,
  additional,
  onClick,
  ...props
}: SongListProps<SongEntry> & ListProps<SongEntry>) => {
  const [{ data }, getQueue] = useResource(api.getQueue);
  useEffect(() => {
    getQueue();
  }, [getQueue]);
  return (
    <List
      className="songlist"
      {...props}
      dataSource={items}
      renderItem={item => (
        <SongListItem
          song={item.song}
          item={item}
          handleClick={onClick}
          queue={data || []}
          additional={additional}
        />
      )}
    ></List>
  );
};

export const DefaultSongEntryList = ({
  additional,
  ...props
}: SongListProps<SongEntry> & ListProps<SongEntry>) => {
  const extendedAdditional = useMemo(() => {
    const extra = (item: SongEntry) => (
      <div className="ant-list-item-meta-description">{item.userName}</div>
    );
    return additional ? [extra, ...additional] : [extra];
  }, [additional]);
  return <SongEntryList additional={extendedAdditional} {...props} />;
};

function SongListItem<T extends Song | SongEntry>({
  handleClick,
  song,
  item,
  queue,
  additional,
  className,
  ...props
}: SongListItem<T> & ListItemProps) {
  const [alteredClassName, setClassName] = useState<string | undefined>(
    className
  );

  const addEnqueuedClass = useCallback(() => {
    setClassName(className ? `${className} enqueued` : "enqueued");
  }, [setClassName, className]);

  const alteredClickHandle = useCallback(() => {
    addEnqueuedClass();
    handleClick(item);
  }, [handleClick, addEnqueuedClass, item]);

  useEffect(() => {
    const contains = queue.some(
      item =>
        item.song.id === song.id && item.song.provider.id === song.provider.id
    );

    if (contains) {
      addEnqueuedClass();
    }
  }, [queue, song, addEnqueuedClass]);

  const additionalElements = useMemo(() => {
    return (
      additional && (
        <ul className="ant-list-item-action ant-list-item-additional">
          {additional.map(fn => (
            <li>{fn(item)}</li>
          ))}
        </ul>
      )
    );
  }, [additional, item]);

  return (
    <List.Item
      {...props}
      className={alteredClassName}
      key={song.title}
      onClick={() => alteredClickHandle()}
      extra={<SongItemExtra song={song} />}
      actions={[<SongItemAction song={song} />]}
    >
      <List.Item.Meta
        title={song.title}
        description={song.description.substr(0, 50)}
        avatar={<AlbumArt song={song} />}
      />
      {additionalElements}
    </List.Item>
  );
}

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

  return <Icon type="star" theme="filled" onClick={click} style={style} />;
};
