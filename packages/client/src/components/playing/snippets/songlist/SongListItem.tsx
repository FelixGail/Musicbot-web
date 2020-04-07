import { Song, SongEntry } from "../../../../core/types";
import { ListItemProps } from "antd/lib/list";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { List } from "antd";
import { AlbumArt } from "../AlbumArt";
import SongItemExtra from "./SongItemExtra";
import SongItemAction from "./SongItemAction";
import { SongListAdditional } from "./SongList";
import styled from "styled-components";

export interface SongListItemProps<T extends Song | SongEntry>
  extends ListItemProps {
  queue: SongEntry[];
  item: T;
  index: number;
  handleClick: (item: T, index: number) => boolean;
  additional?: SongListAdditional<T>;
}

export function itemToSong<T extends Song | SongEntry>(item: T): Song {
  const sAny = item as any;
  if (sAny.song) {
    return sAny.song;
  }
  return sAny;
}

export function isSongEntry(item: Song | SongEntry): item is SongEntry {
  const sAny = item as any;
  if (sAny.username) {
    return true;
  }
  return false;
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
    if (handleClick(item, index)) {
      addEnqueuedClass();
    }
  }, [handleClick, addEnqueuedClass, item, index]);

  useEffect(() => {
    const contains = queue.some(
      (item) =>
        item.song.id === song.id && item.song.provider.id === song.provider.id
    );

    if (contains) {
      addEnqueuedClass();
    }
  }, [queue, song, addEnqueuedClass]);

  const actions = useMemo(() => {
    const songAction = <SongItemAction song={song} />
    if(additional) {
      const mapped = additional?.map(it => it(item))
      mapped.push(songAction)
      return mapped
    }
    return [songAction]
  }, [additional, item, song]);

  return (
    <List.Item
      {...props}
      className={alteredClassName}
      key={song.title}
      onClick={() => alteredClickHandle()}
      extra={<SongItemExtra item={item} />}
      actions={actions}
    >
      <List.Item.Meta
        title={song.title}
        description={song.description}
        avatar={<StyledAlbumArt song={song} />}
      />
    </List.Item>
  );
}

const StyledAlbumArt = styled(AlbumArt)`
  width: 50px;
  height: auto;
`;

export default SongListItem;
