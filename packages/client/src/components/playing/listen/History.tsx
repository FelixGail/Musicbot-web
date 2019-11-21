import React, { useCallback } from "react";
import { useResource } from "react-request-hook";
import api from "../../../core/api/model";
import useReload from "../../../core/reloadHook";
import { DefaultSongEntryList } from "../snippets/songlist/SongList";
import ScreenNavigation from "../../util/ScreenNavigation";
import useResourceWithPermission from "../../../core/api/permissionWrapperHook";
import { Permission, SongEntry } from "../../../core/types";

const History = () => {
  const [{ data }, getHistory] = useResource(api.getHistory);
  const [, enqueue] = useResourceWithPermission(
    api.enqueue,
    Permission.ENQUEUE
  );
  const enqueueWrapper = useCallback(
    (value: SongEntry) => {
      enqueue([], value.song);
    },
    [enqueue]
  );
  useReload(getHistory);

  return (
    <div className="history">
      <DefaultSongEntryList
        header="History"
        items={data}
        onClick={enqueueWrapper}
      />
      <ScreenNavigation left="queue" right="/listen" />
    </div>
  );
};

export default History;
