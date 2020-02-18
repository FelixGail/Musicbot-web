import React, { useCallback, useMemo } from "react";
import api from "../../../core/api/model";
import { DefaultSongEntryList } from "../snippets/songlist/SongList";
import ScreenNavigation from "../../util/ScreenNavigation";
import { Permission, SongEntry } from "../../../core/types";
import { useResourceReload } from "../../../core/hooks/usePlayerStateContext";
import { useResource } from "react-request-hook";
import useHasPermission from "../../../core/hooks/useHasPermission";

const History = () => {
  const history = useResourceReload(api.getHistory, [])
  const [, enqueue] = useResource(api.enqueue);
  const hasEnqueuePermission = useHasPermission(Permission.ENQUEUE)

  const enqueueWrapper = useCallback(
    (value: SongEntry) => {
      hasEnqueuePermission && enqueue(value.song);
    },
    [enqueue, hasEnqueuePermission]
  );

  const jsx = useMemo(() => (
    <div className="history">
      <ScreenNavigation left="queue" right="/listen" />
      <DefaultSongEntryList
        header="History"
        items={history}
        onClick={enqueueWrapper}
      />
    </div>
  ), [history, enqueueWrapper])

  return jsx;
};

export default History;
