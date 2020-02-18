import ContextModal, { ContextModalElement } from "./ContextModal";
import { useContext, useMemo } from "react";
import { RouteComponentProps, useHistory} from "react-router";
import { SongEntry, Song } from "../../core/types";
import { LikedSongContext } from "../../core/context/LikedSongsContext";
import { itemToSong } from "../playing/snippets/songlist/SongListItem";
import { ModalProps } from "antd/lib/modal";

export interface DefaultContextModalProps<T extends Song | SongEntry>
  extends RouteComponentProps<{ element: string }>,
    ModalProps {
  elements?: ContextModalElement<T>[];
  data: T[];
}

function DefaultContextModal<T extends Song | SongEntry>({
  data,
  match,
  ...props
}: DefaultContextModalProps<T>) {
  const isValid =
    +match.params.element >= 0 && data.length > +match.params.element;

  return isValid
    ? InnerDefaultContextModal({ data: data, match: match, ...props })
    : null;
}

function InnerDefaultContextModal<T extends Song | SongEntry>({
  data,
  elements,
  history,
  match,
  maskClosable,
  centered,
  ...props
}: DefaultContextModalProps<T>) {
  const item = useMemo(() => data[+match.params.element], [
    data,
    match.params.element
  ]);
  const song = useMemo(() => itemToSong(item), [item]);
  const likedSongs = useContext(LikedSongContext);
  const isLikedSong = useMemo(() => likedSongs.contains(song), [
    likedSongs,
    song
  ]);

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
    visible: true,
    elements: combinedElements,
    title: song.title,
    centered: true,
    mask: false,
    closable: false,
    footer: null,
    clickAway: history.goBack,
    ...props
  });
}

export function useSearchSongModalElements<T extends Song | SongEntry>(): ContextModalElement<T>[] {
  const history = useHistory()
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
