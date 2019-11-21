import React, {
  FunctionComponent,
  useCallback,
  useState,
  Fragment,
  useMemo
} from "react";
import DefaultSongEntryList from "./DefaultSongEntryList";
import { SongListAdditional, SongListProps } from "./SongList";
import { SongEntry, Song } from "../../../../core/types";
import ContextModal, { ContextModalElement } from "../../../util/ContextModal";
import SongListItem from "./SongListItem";

export interface ContextSongEntryListProps extends SongListProps<SongEntry> {
  elements: ContextModalElement[];
  title?: string;
}

export interface ContextSongListItemProps {
  item: SongEntry;
  elements: ContextModalElement[];
  queue: SongEntry[];
  title?: string;
  additional?: SongListAdditional<SongEntry>;
}

const ContextSongEntryList: FunctionComponent<ContextSongEntryListProps> = ({
  header,
  ...props
}) => {
  const renderFunction = useCallback(
    (queue: SongEntry[], additional?: SongListAdditional<SongEntry>) => {
      return (item: SongEntry) => (
        <ContextSongListItem
          item={item}
          elements={props.elements}
          queue={queue}
          additional={additional}
          title={props.title}
        />
      );
    },
    []
  );

  return <DefaultSongEntryList {...props} render={renderFunction} />;
};

export const ContextSongListItem = (props: ContextSongListItemProps) => {
  const [visible, setVisibility] = useState(false);
  const setInvisible = useCallback(() => setVisibility(false), [setVisibility]);
  const setVisible = useCallback(() => setVisibility(true), [setVisibility]);

  const combinedElements = useMemo(() => {
    return props.elements.concat({ element: "close", onClick: setInvisible });
  }, [setInvisible, props.elements]);

  return (
    <Fragment>
      <ContextModal
        title={props.title}
        elements={combinedElements}
        visible={visible}
      />
      <SongListItem
        item={props.item}
        additional={props.additional}
        queue={props.queue}
        handleClick={setVisible}
      />
    </Fragment>
  );
};

export default ContextSongEntryList;
