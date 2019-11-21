import { List } from "antd";
import React, { useEffect, useMemo } from "react";
import { Song, SongEntry } from "../../../../core/types";
import { ListProps, ListItemProps } from "antd/lib/list";
import { useResource } from "react-request-hook";
import api from "../../../../core/api/model";
import SongListItem from "./SongListItem";

export type SongListAdditional<T extends Song | SongEntry> = ((
  item: T
) => JSX.Element | null)[];

export interface SongListProps<T extends Song | SongEntry>
  extends ListProps<T> {
  items?: T[];
  onClick: (item: T) => void;
  additional?: SongListAdditional<T>;
}

function itemToSong<T extends Song | SongEntry>(item: T): Song {
  const sAny = item as any;
  if (sAny.song) {
    return sAny.song;
  }
  return sAny;
}

export function SongList<T extends Song | SongEntry>({
  items,
  additional,
  onClick,
  ...props
}: SongListProps<T>) {
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
          song={itemToSong(item)}
          item={item}
          handleClick={onClick}
          queue={data || []}
          additional={additional}
        />
      )}
    />
  );
}

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
  return <SongList additional={extendedAdditional} {...props} />;
};
