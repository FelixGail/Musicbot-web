import ContextModal, { ContextModalElement } from "./ContextModal";
import React, { useMemo, useState, useEffect, useContext } from "react";
import { useHistory, match } from "react-router";
import { SongEntry, Song } from "../../core/types";
import { itemToSong } from "./list/songlist/SongListItem";
import { ModalProps } from "antd/lib/modal";
import { Typography } from "antd";
import { db } from "../../core/db/AppDB";
import { fromSong } from "../../core/db/LikedSong";
import { ConfigurationContext } from "../../core/context/Configuration";

export interface DefaultContextModalProps<T extends Song | SongEntry>
  extends ModalProps {
  elements?: ContextModalElement<T>[];
  data: T[];
  match: match<{ element: string }>;
}

function DefaultContextModal<T extends Song | SongEntry>({
  data,
  match,
  ...props
}: DefaultContextModalProps<T>) {
  const element = match && +match.params.element;
  const isValid = match && element >= 0 && data.length > element;

  return isValid
    ? InnerDefaultContextModal({ data: data, id: element, match, ...props })
    : null;
}

function InnerDefaultContextModal<T extends Song | SongEntry>({
  data,
  elements,
  id,
  maskClosable,
  centered,
  ...props
}: DefaultContextModalProps<T> & { id: number }) {
  const item = useMemo(() => data[id], [data, id]);
  const song = useMemo(() => itemToSong(item), [item]);
  const {configuration} = useContext(ConfigurationContext)
  const [combinedElements, setElements] = useState<ContextModalElement<T>[]>();
  const history = useHistory();

  useEffect(() => {
    db.songs.get(song.id).then(value => {
      const isLikedSong = value !== undefined
      const defaultElements: ContextModalElement<T>[] = [
        {
          element: () => `${isLikedSong ? "Remove from" : "Add to"} my songs`,
          onClick: () => {
            isLikedSong ? db.songs.delete(song.id) : fromSong(song).save(configuration);
          },
          close: true,
        },
        {
          element: () => "Close",
          onClick: () => {},
          close: true,
        },
      ];
      const combined = (elements ? elements.concat(defaultElements) : defaultElements).map(
        ({ element, onClick, close }) => {
          return {
            element: element,
            onClick: (item: T) => {
              onClick(item);
              close && history.goBack();
            },
          };
        }
      );
      setElements(combined);
    })
  }, [setElements, elements, history, song, configuration])

  return ContextModal<T>({
    item: item,
    elements: combinedElements,
    visible: true,
    title: (
      <Typography.Paragraph ellipsis={{ rows: 2, expandable: true }}>
        {song.title}
      </Typography.Paragraph>
    ),
    centered: true,
    mask: true,
    maskClosable: true,
    closable: false,
    footer: null,
    onCancel: history.goBack,
    ...props,
  });
}

export function useSearchSongModalElements<
  T extends Song | SongEntry
>(): ContextModalElement<T>[] {
  const history = useHistory();
  return useMemo(
    () => [
      {
        element: (item) => `Search for '${itemToSong(item).title}'`,
        onClick: (item) => {
          history.push(`/add/search?${encodeURI(itemToSong(item).title)}`);
        },
        close: false,
      },
      {
        element: (item) =>
          `Search for '${itemToSong(item).description.substr(0, 50)}'`,
        onClick: (item) => {
          history.push(
            `/add/search?${encodeURI(
              itemToSong(item).description.substr(0, 50)
            )}`
          );
        },
        close: false,
      },
    ],
    [history]
  );
}

export default DefaultContextModal;
