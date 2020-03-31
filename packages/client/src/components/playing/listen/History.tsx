import React, {useCallback, useMemo, useContext} from 'react';
import api from '../../../core/api/model';
import {DefaultSongEntryList} from '../snippets/songlist/SongList';
import ScreenNavigation from '../../util/ScreenNavigation';
import {Permission, SongEntry} from '../../../core/types';
import {useResource} from 'react-request-hook';
import useHasPermission from '../../../core/hooks/useHasPermission';
import {FullscreenContext} from '../../../core/context/FullscreenContext';
import PlayerStateContext from '../../../core/context/PlayerStateContext';

const History = () => {
  const { history } = useContext(PlayerStateContext)
  const [, enqueue] = useResource(api.enqueue);
  const hasEnqueuePermission = useHasPermission(Permission.ENQUEUE);
  const toggleFullscreen = useContext(FullscreenContext);

  const enqueueWrapper = useCallback(
    (value: SongEntry) => {
      hasEnqueuePermission && enqueue(value.song);
    },
    [enqueue, hasEnqueuePermission]
  );

  const jsx = useMemo(
    () => (
      <div className="history full-width full-height centering">
        <ScreenNavigation
          left="queue"
          right="/listen"
          center={toggleFullscreen}
        />
        <DefaultSongEntryList
          header="History"
          items={history}
          onClick={enqueueWrapper}
        />
      </div>
    ),
    [history, enqueueWrapper, toggleFullscreen]
  );

  return jsx;
};

export default History;
