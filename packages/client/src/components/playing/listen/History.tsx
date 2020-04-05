import React, { useCallback, useMemo, useContext } from "react";
import api from "../../../core/api/model";
import { SongList } from "../snippets/songlist/SongList";
import ScreenNavigation from "../../util/ScreenNavigation";
import { Permission, SongEntry } from "../../../core/types";
import { useResource } from "react-request-hook";
import useHasPermission from "../../../core/hooks/useHasPermission";
import { FullscreenContext } from "../../../core/context/FullscreenContext";
import PlayerStateContext from "../../../core/context/PlayerStateContext";
import { useHistory } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

const History = () => {
  const { history } = useContext(PlayerStateContext);
  const [, enqueue] = useResource(api.enqueue);
  const hasEnqueuePermission = useHasPermission(Permission.ENQUEUE);
  const toggleFullscreen = useContext(FullscreenContext);
  const browserHistory = useHistory();
  const left = `queue`;
  const right = `/listen`;
  const swipeHandler = useSwipeable({
    onSwipedLeft: () => browserHistory.push(right),
    onSwipedRight: () => browserHistory.push(left),
    preventDefaultTouchmoveEvent: true
  });

  const enqueueWrapper = useCallback(
    (value: SongEntry) => {
      if (hasEnqueuePermission) {
        enqueue(value.song);
        return true;
      }
      return false;
    },
    [enqueue, hasEnqueuePermission]
  );

  const jsx = useMemo(
    () => (
      <div
        className="history full-width full-height centering"
        {...swipeHandler}
      >
        <ScreenNavigation left={left} right={right} center={toggleFullscreen} />
        <SongList
          header="History"
          items={history}
          onClick={enqueueWrapper}
        />
      </div>
    ),
    [history, enqueueWrapper, toggleFullscreen, left, right, swipeHandler]
  );

  return jsx;
};

export default History;
