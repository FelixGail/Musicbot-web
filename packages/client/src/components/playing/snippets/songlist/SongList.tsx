import { List } from "antd";
import React, { useMemo } from "react";
import { Song, SongEntry } from "../../../../core/types";
import { ListProps } from "antd/lib/list";
import SongListItem from "./SongListItem";
import { ContextModalElement } from "../../../util/ContextModal";
import { useContext } from 'react';
import PlayerStateContext from '../../../../core/context/PlayerStateContext';
import DefaultContextModal from "../../../util/DefaultContextModal";
import { Route } from "react-router-dom";

export type SongListAdditional<T extends Song | SongEntry> = ((
  item: T
) => JSX.Element | null)[];

export interface SongListProps<T extends Song | SongEntry>
  extends ListProps<T> {
  items?: T[];
  onClick: (item: T, index: number) => void;
  additional?: SongListAdditional<T>;
  contextModal?: ListContextModal<T>;
}

export interface ListContextModal<T extends Song | SongEntry> {
  route: string;
  elements: ContextModalElement<T>[];
}

export function SongList<T extends Song | SongEntry>({
  items,
  additional,
  onClick,
  contextModal,
  ...props
}: SongListProps<T>) {
  const {queue} = useContext(PlayerStateContext)

  const modalJSX = useMemo(() => {
    return (
      contextModal && (
        <Route
          path={`${contextModal.route}/:element`}
          render={({ match }) => (
            <DefaultContextModal
              data={items || []}
              elements={contextModal.elements}
              match={match}
            />
          )}
        />
      )
    );
  }, [contextModal, items]);

  return (
    <div className="songlist">
      {modalJSX}
      <List
        className=""
        {...props}
        dataSource={items}
        renderItem={(item, index) => (
          <SongListItem
            item={item}
            index={index}
            handleClick={onClick}
            queue={queue}
            additional={additional}
          />
        )}
      />
    </div>
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
