import React, { useCallback, useEffect } from "react";
import api from "../../../core/api/model";
import useReload from "../../../core/hooks/reloadHook";
import { DefaultSongEntryList } from "../snippets/songlist/SongList";
import ScreenNavigation from "../../util/ScreenNavigation";
import useResourceWithPermission from "../../../core/api/permissionWrapperHook";
import { Permission, SongEntry } from "../../../core/types";
import { useResource } from "react-request-hook";

const History = () => {
  const [{ data }, getHistory] = useResource(api.getHistory);
  useReload(getHistory);
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

  return (
    <div className="history">
      <ScreenNavigation left="queue" right="/listen" />
      <DefaultSongEntryList
        header="History"
        items={data}
        onClick={enqueueWrapper}
      />
    </div>
  );
};

export default History;
