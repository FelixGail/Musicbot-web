import React, { useMemo } from "react";
import { SongEntry } from "../../../../core/types";
import { SongListProps, SongList } from "./SongList";

const DefaultSongEntryList = ({
  additional,
  ...props
}: SongListProps<SongEntry>) => {
  const extendedAdditional = useMemo(() => {
    const extra = (item: SongEntry) => (
      <div className="ant-list-item-meta-description">{item.userName}</div>
    );
    return additional ? [extra, ...additional] : [extra];
  }, [additional]);
  return <SongList additional={extendedAdditional} {...props} />;
};

export default DefaultSongEntryList;
