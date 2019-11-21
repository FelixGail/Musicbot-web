import { List } from "antd";
import React, { useEffect, useMemo, useCallback, ReactNode } from "react";
import { Song, SongEntry } from "../../../../core/types";
import { ListProps } from "antd/lib/list";
import { useResource } from "react-request-hook";
import api from "../../../../core/api/model";
import SongListItem from "./SongListItem";

export type SongListAdditional<T extends Song | SongEntry> = ((
  item: T
) => JSX.Element | null)[];

export type RenderFunction<T extends Song | SongEntry> = (
  queue: SongEntry[],
  additional?: SongListAdditional<T>,
  onClick?: (item: T) => void
) => (item: T) => ReactNode;

export interface SongListProps<T extends Song | SongEntry>
  extends ListProps<T> {
  items?: T[];
  onClick?: (item: T) => void;
  additional?: SongListAdditional<T>;
  render?: RenderFunction<T>;
}

export function SongList<T extends Song | SongEntry>({
  items,
  additional,
  onClick,
  render,
  ...props
}: SongListProps<T>) {
  const [{ data }, getQueue] = useResource(api.getQueue);
  useEffect(() => {
    getQueue();
  }, [getQueue]);

  const queue = useMemo(() => data || [], [data]);

  const renderWrapper = useMemo(() => {
    return render
      ? render(queue, additional, onClick)
      : (item: T) => (
          <SongListItem
            item={item}
            handleClick={onClick}
            queue={queue}
            additional={additional}
          />
        );
  }, [onClick, additional, queue, render]);

  return (
    <List
      className="songlist"
      {...props}
      dataSource={items}
      renderItem={renderWrapper}
    />
  );
}
