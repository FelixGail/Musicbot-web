import React, { useCallback, useContext, useMemo } from "react";
import { useResource } from "react-request-hook";
import api from "../../../core/api/model";
import useReload from "../../../core/reloadHook";
import { DefaultSongEntryList } from "../snippets/songlist/SongList";
import ScreenNavigation from "../../util/ScreenNavigation";
import { SongEntry, Permission } from "../../../core/types";
import { ConfigurationContext } from "../../../core/context/Configuration";
import Conditional from "../../util/Conditional";
import { Icon } from "antd";

const Queue = () => {
  const [{ data }, getQueue] = useResource(api.getQueue);
  useReload(getQueue);

  const [, dequeue] = useResource(api.dequeue);
  const dequeueWrapper = useCallback(
    (value: SongEntry) => {
      dequeue(value.song);
    },
    [dequeue]
  );

  const { configuration } = useContext(ConfigurationContext);
  const permission = useMemo(
    () =>
      (configuration.permissions &&
        configuration.permissions.includes(Permission.SKIP)) ||
      false,
    [configuration.permissions]
  );

  const additional = useCallback(
    (item: SongEntry) => (
      <Conditional
        condition={permission || item.userName === configuration.username}
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
    [configuration.username, dequeue, permission]
  );

  return (
    <div className="queue">
      <DefaultSongEntryList
        header="Queue"
        items={data}
        onClick={dequeueWrapper}
        additional={[additional]}
      />
      <ScreenNavigation left="/listen" right="history" />
    </div>
  );
};

export default Queue;
