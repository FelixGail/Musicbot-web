import React, {
  useCallback,
  useContext,
  useMemo,
  FunctionComponent,
  useEffect
} from "react";
import { useResource } from "react-request-hook";
import api from "../../../core/api/model";
import useReload from "../../../core/hooks/reloadHook";
import { DefaultSongEntryList } from "../snippets/songlist/SongList";
import ScreenNavigation from "../../util/ScreenNavigation";
import { SongEntry, Permission, songEntryEquals } from "../../../core/types";
import { ConfigurationContext } from "../../../core/context/Configuration";
import Conditional from "../../util/Conditional";
import { Icon } from "antd";
import { Route, RouteComponentProps } from "react-router";
import { ContextModalElement } from "../../util/ContextModal";
import DefaultContextModal, {
  useSearchSongModalElements
} from "../../util/DefaultContextModal";
import Permissional from "../../util/Permissional";
import useHasPermission from "../../../core/hooks/useHasPermission";
import { useLogger } from "react-use";
import useArrayEquals from "../../../core/hooks/useArrayEquals";
import useEquallingReload from "../../../core/hooks/useEquallingReload";

const Queue: FunctionComponent<RouteComponentProps> = props => {
  useLogger("queue", props);
  const compareQueue = useArrayEquals(songEntryEquals);
  const queue = useEquallingReload(api.getQueue, compareQueue, []);

  const [, dequeue] = useResource(api.dequeue);
  const click = useCallback(
    (_, index: number) => {
      props.history.push(`${props.match.url}/${index}`);
    },
    [props.history, props.match.url]
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

  const searchElements = useSearchSongModalElements<SongEntry>(props);
  const [, move] = useResource(api.moveEntry);
  const contextElements: ContextModalElement<SongEntry>[] = useMemo(() => {
    return [
      {
        element: () => (
          <Permissional permission={Permission.MOVE}>Move to top</Permissional>
        ),
        onClick: item => move(0, item.song)
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
        onClick: item => dequeue(item.song)
      }
    ];
  }, [move, hasRemovePermission, configuration.username, dequeue]);
  const combinedElements = useMemo(
    () => contextElements.concat(searchElements),
    [searchElements, contextElements]
  );

  return (
    <div className="queue">
      <ScreenNavigation left="/listen" right="history" />
      <DefaultSongEntryList
        header="Queue"
        items={queue}
        onClick={click}
        additional={[additional]}
      />
      <Route
        path="*/queue/:element"
        render={props => (
          <DefaultContextModal
            data={queue}
            elements={combinedElements}
            {...props}
          />
        )}
      />
    </div>
  );
};

export default Queue;
