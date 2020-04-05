import ContextModal, { ContextModalElement } from "./ContextModal";
import React, { useContext, useMemo } from "react";
import { useHistory, match } from "react-router";
import { SongEntry, Song } from "../../core/types";
import { LikedSongContext } from "../../core/context/LikedSongsContext";
import { itemToSong } from "../playing/snippets/songlist/SongListItem";
import { ModalProps } from "antd/lib/modal";
import { Typography } from "antd";

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
  const likedSongs = useContext(LikedSongContext);
  const isLikedSong = useMemo(() => likedSongs.contains(song), [
    likedSongs,
    song
  ]);
  const history = useHistory();

  const combinedElements: ContextModalElement<T>[] = useMemo(() => {
    const defaultElements: ContextModalElement<T>[] = [
      {
        element: () => `${isLikedSong ? "Remove from" : "Add to"} my songs`,
        onClick: () => {
          isLikedSong ? likedSongs.removeSong(song) : likedSongs.addSong(song);
        },
        close: true
      },
      {
        element: () => "Close",
        onClick: () => {},
        close: true
      }
    ];
    return (elements ? elements.concat(defaultElements) : defaultElements).map(
      ({ element, onClick, close }) => {
        return {
          element: element,
          onClick: (item: T) => {
            onClick(item);
            close && history.goBack();
          }
        };
      }
    );
  }, [likedSongs, song, history, elements, isLikedSong]);

  return ContextModal<T>({
    item: item,
    elements: combinedElements,
    visible: true,
    title: 
      <Typography.Paragraph ellipsis={{ rows: 2, expandable: true }}>
        {song.title}
      </Typography.Paragraph>,
    centered: true,
    mask: true,
    maskClosable: true,
    closable: false,
    footer: null,
    onCancel: history.goBack,
    ...props
  });
}

export function useSearchSongModalElements<
  T extends Song | SongEntry
>(): ContextModalElement<T>[] {
  const history = useHistory();
  return useMemo(
    () => [
      {
        element: item => `Search for '${itemToSong(item).title}'`,
        onClick: item => {
          history.push(`/add/search?${encodeURI(itemToSong(item).title)}`);
        },
        close: false
      },
      {
        element: item =>
          `Search for '${itemToSong(item).description.substr(0, 50)}'`,
        onClick: item => {
          history.push(
            `/add/search?${encodeURI(
              itemToSong(item).description.substr(0, 50)
            )}`
          );
        },
        close: false
      }
    ],
    [history]
  );
}

export default DefaultContextModal;
