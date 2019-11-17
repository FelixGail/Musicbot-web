import React, { useCallback } from "react";
import { useResource } from "react-request-hook";
import api from "../../../core/api/model";
import useReload from "../../../core/reloadHook";
import { SongEntryList } from "../snippets/SongList";
import ScreenNavigation from "../../util/ScreenNavigation";
import { SongEntry } from "../../../core/types";

const Queue = () => {
  const [{ data }, getQueue] = useResource(api.getQueue);
  const [, dequeue] = useResource(api.dequeue);
  const dequeueWrapper = useCallback(
    (value: SongEntry) => {
      dequeue(value.song);
    },
    [dequeue]
  );

  useReload(getQueue);

  return (
    <div className="queue">
      <SongEntryList header="Queue" items={data} onClick={dequeueWrapper} />
      <ScreenNavigation left="/listen" right="history" />
    </div>
  );
};

export default Queue;
