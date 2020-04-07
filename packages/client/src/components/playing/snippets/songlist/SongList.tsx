import { List } from "antd";
import React, { useMemo, Fragment } from "react";
import { Song, SongEntry } from "../../../../core/types";
import { ListProps } from "antd/lib/list";
import SongListItem from "./SongListItem";
import { ContextModalElement } from "../../../util/ContextModal";
import { useContext } from "react";
import PlayerStateContext from "../../../../core/context/PlayerStateContext";
import DefaultContextModal from "../../../util/DefaultContextModal";
import { Route } from "react-router-dom";
import styled from "styled-components";

export type SongListAdditional<T extends Song | SongEntry> = ((
  item: T
) => JSX.Element | null)[];

export interface SongListProps<T extends Song | SongEntry>
  extends ListProps<T> {
  items?: T[];
  onClick: (item: T, index: number) => boolean;
  additional?: SongListAdditional<T>;
  contextModal?: ListContextModal<T>;
}

export interface ListContextModal<T extends Song | SongEntry> {
  route: string;
  elements: ContextModalElement<T>[];
}

const StyledList = styled(List)`
  flex: 1;

  h4,
  .ant-list-header,
  .ant-empty-description {
    color: #e6e6e6;
  }

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

  h4,
  .ant-list-item-meta-description,
  .ant-list-item-action {
    text-shadow: 1px 1px 2px black;
  }

  .ant-list-item-meta-description {
    color: #808080;
  }

  .ant-list-header {
    font-size: 18px;
  }

  .ant-list-item {
    padding: 5px;
    flex-wrap: nowrap;

    &:hover {
      background-color: #1890ff;
      cursor: pointer;

      h4,
      .ant-list-item-meta-description {
        color: #e5e5e5;
      }
    }
  }

  .ant-list-item-action {
    .anticon {
      color: #e6e6e6;

      &:hover {
        color: #68758d;
      }
    }

    color: #e6e6e6;
    padding-left: 12px;
    margin-left: 0px;
  }

  .ant-list-item-additional {
    ul {
      padding-right: 0px;
    }
    padding-left: 24px;
    margin-left: 0px;

    @media only screen and (max-width: 600px) {
      padding-left: 8px;
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
`;

export function SongList<T extends Song | SongEntry>({
  items,
  additional,
  onClick,
  contextModal,
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

  return (
    <Fragment>
      <StyledList
        {...props}
        dataSource={items}
        renderItem={(item: T, index: number) => (
          <SongListItem
            item={item}
            index={index}
            handleClick={onClick}
            queue={queue}
            additional={additional}
          />
        )}
      />
      {modalJSX}
    </Fragment>
  );
}
