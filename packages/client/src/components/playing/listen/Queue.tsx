import React, {
  useCallback,
  useContext,
  useMemo,
  FunctionComponent
} from "react";
import { useResource } from "react-request-hook";
import api from "../../../core/api/model";
import { DefaultSongEntryList } from "../snippets/songlist/SongList";
import ScreenNavigation from "../../util/ScreenNavigation";
import { SongEntry, Permission } from "../../../core/types";
import { ConfigurationContext } from "../../../core/context/Configuration";
import Conditional from "../../util/Conditional";
import { Icon } from "antd";
import { useHistory, useLocation } from "react-router";
import { ContextModalElement } from "../../util/ContextModal";
import { useSearchSongModalElements } from "../../util/DefaultContextModal";
import Permissional from "../../util/Permissional";
import useHasPermission from "../../../core/hooks/useHasPermission";
import { useResourceReload } from "../../../core/hooks/usePlayerStateContext";

const Queue: FunctionComponent = () => {
  const queue = useResourceReload(api.getQueue, [])
  const hstry = useHistory()
  const location = useLocation()

  const [, dequeue] = useResource(api.dequeue);
  const click = useCallback(
    (_, index: number) => {
      hstry.push(`${location.pathname}/${index}`);
    },
    [hstry, location.pathname]
  );


  const hasRemovePermission = useHasPermission(Permission.SKIP);
  const { configuration } = useContext(ConfigurationContext);

  const additional = useCallback(
    (item: SongEntry) => (
      <Conditional
        condition={
          hasRemovePermission || item.userName === configuration.username
        }
        alt={<div style={{ paddingLeft: "7px", paddingRight: "7px" }}></div>}
      >
        <Icon
          type="delete"
          onClick={event => {
            dequeue(item.song);
            event.stopPropagation();
          }}
        />
      </Conditional>
    ),
    [configuration.username, dequeue, hasRemovePermission]
  );
  const additionalArray = useMemo(() => [additional], [additional])

  const searchElements = useSearchSongModalElements<SongEntry>();
  const [, move] = useResource(api.moveEntry);
  const contextElements: ContextModalElement<SongEntry>[] = useMemo(() => {
    return [
      {
        element: () => (
          <Permissional permission={Permission.MOVE}>Move to top</Permissional>
        ),
        onClick: item => move(0, item.song),
        close: true
      },
      {
        element: item => (
          <Conditional
            condition={
              hasRemovePermission || item.userName === configuration.username
            }
          >
            Remove
          </Conditional>
        ),
        onClick: item => dequeue(item.song),
        close: true
      }
    ];
  }, [move, hasRemovePermission, configuration.username, dequeue]);
  const combinedElements = useMemo(
    () => contextElements.concat(searchElements),
    [searchElements, contextElements]
  );

    const jsx = useMemo(() => (
      <div className="queue">
      <ScreenNavigation left="/listen" right="history" />
      <DefaultSongEntryList
        header="Queue"
        items={queue}
        onClick={click}
        additional={additionalArray}
        contextModal={{route: "*/queue", elements: combinedElements}}
      />
    </div>
    ), [queue, click, additionalArray, combinedElements])

  return jsx;
};

export default Queue;
