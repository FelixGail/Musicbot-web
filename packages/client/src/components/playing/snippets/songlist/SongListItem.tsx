import { Song, SongEntry } from "../../../../core/types";
import { ListItemProps } from "antd/lib/list";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { List } from "antd";
import { AlbumArt } from "../AlbumArt";
import SongItemExtra from "./SongItemExtra";
import SongItemAction from "./SongItemAction";
import { SongListAdditional } from "./SongList";

export interface SongListItemProps<T extends Song | SongEntry>
  extends ListItemProps {
  queue: SongEntry[];
  item: T;
  index: number;
  handleClick: (item: T, index: number) => void;
  additional?: SongListAdditional<T>;
}

export function itemToSong<T extends Song | SongEntry>(item: T): Song {
  const sAny = item as any;
  if (sAny.song) {
    return sAny.song;
  }
  return sAny;
}

function SongListItem<T extends Song | SongEntry>({
  handleClick,
  item,
  index,
  queue,
  additional,
  className,
  ...props
}: SongListItemProps<T>) {
  const [alteredClassName, setClassName] = useState<string | undefined>(
    className
  );

  const song = useMemo(() => itemToSong(item), [item]);

  const addEnqueuedClass = useCallback(() => {
    setClassName(className ? `${className} enqueued` : "enqueued");
  }, [setClassName, className]);

  const alteredClickHandle = useCallback(() => {
    addEnqueuedClass();
    handleClick(item, index);
  }, [handleClick, addEnqueuedClass, item, index]);

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
          {additional.map((fn, index) => (
            <li key={index}>{fn(item)}</li>
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

export default SongListItem;
