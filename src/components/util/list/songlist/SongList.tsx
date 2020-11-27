import { ListProps } from 'antd/lib/list';
import SongListItem from './SongListItem';
import { ContextModalElement } from '../../ContextModal';
import React, { Fragment, useCallback, useContext, useMemo } from 'react';
import PlayerStateContext from '../../../../core/context/PlayerStateContext';
import DefaultContextModal from '../../DefaultContextModal';
import { Route } from 'react-router-dom';
import styled, { StyledComponent } from 'styled-components';
import { StyledList } from '../StyledList';
import { List } from 'antd/lib/form/Form';
import { Song, SongEntry } from '../../../../core/types';

export type SongListAdditional<T extends Song | SongEntry> = ((
  item: T,
) => JSX.Element | null)[];

export interface SongListProps<T extends Song | SongEntry>
  extends ListProps<T> {
  items?: T[];
  onClick: (item: T, index: number) => boolean;
  additional?: SongListAdditional<T>;
  contextModal?: ListContextModal<T>;
  wrapper?: (
    item: T,
    index: number,
    children: (item: T, index: number) => JSX.Element,
  ) => JSX.Element;
}

export interface ListContextModal<T extends Song | SongEntry> {
  route: string;
  elements: ContextModalElement<T>[];
}

function defaultWrapper<T>(
  item: T,
  index: number,
  children: (item: T, index: number) => JSX.Element,
): JSX.Element {
  return children(item, index);
}

const StyledSongList = styled(StyledList)`
  .ant-list-item-meta {
    overflow: hidden;
    align-items: center;
  }

  .ant-list-item-meta-title,
  .ant-list-item-meta-description {
    overflow: hidden;
    max-height: 22px;
    max-width: 100%;
  }

  .ant-list-header {
    font-size: 18px;
  }

  .ant-list-item {
    padding: 5px;
    flex-wrap: nowrap;
  }

  .ant-list-item-action-split {
    display: none;
  }

  .ant-list-item-action {
    .anticon {
      color: #e6e6e6;

      &:hover {
        color: #68758d;
      }
    }

    padding-left: 6px;
    padding-right: 6px;
    color: #e6e6e6;
    margin-left: 0px;

    li {
      padding-left: 2px;
      padding-right: 2px;
    }
  }

  .ant-list-items::-webkit-scrollbar {
    width: 0px;
    display: none;
  }

  .ant-list-items {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
` as StyledComponent<typeof List, any, any, never>;

export function SongList<T extends Song | SongEntry>({
  items,
  additional,
  onClick,
  contextModal,
  wrapper,
  ...props
}: SongListProps<T>) {
  const { queue } = useContext(PlayerStateContext);

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

  const wrapListItem = wrapper || defaultWrapper;

  const renderListItem = useCallback(
    (item: T, index: number) => {
      return wrapListItem(item, index, (inner_item, inner_index) => {
        return (
          <SongListItem
            item={inner_item}
            index={inner_index}
            handleClick={onClick}
            queue={queue}
            additional={additional}
          />
        );
      });
    },
    [onClick, queue, additional, wrapListItem],
  );

  return (
    <Fragment>
      <StyledSongList
        {...props}
        dataSource={items}
        renderItem={renderListItem}
      />
      {modalJSX}
    </Fragment>
  );
}
