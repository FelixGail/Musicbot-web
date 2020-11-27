import { Slider } from 'antd';
import React, { Fragment, useCallback, useState } from 'react';
import { useResource } from 'react-request-hook';
import { useDebounce } from 'react-use';
import { useResourceReload } from '../../core/hooks/resourceReloadHook';
import Operations, { getHookRequest } from '../../core/rest/operations';
import { Permission } from '../../core/types';
import Permissional from '../util/Permissional';
import { StyledDivider } from './Styles';

export const VolumeSlider = (): JSX.Element => {
  const [volume, setVolumeLocally] = useResourceReload(
    Operations.getVolume,
    { volume: 0, isSupported: false },
    1000,
    false,
  );

  const [, setVolumeRemote] = useResource(getHookRequest(Operations.setVolume));
  const [undebouncedVolume, setUndebouncedVolume] = useState<number>();

  const volumeCallback = useCallback(
    (value: number) => {
      setUndebouncedVolume(value);
      setVolumeLocally({ volume: value, isSupported: volume.isSupported });
    },
    [setUndebouncedVolume, setVolumeLocally, volume],
  );

  useDebounce(
    () => {
      undebouncedVolume && setVolumeRemote(undebouncedVolume);
    },
    500,
    [undebouncedVolume, setVolumeRemote],
  );

  return volume.isSupported ? (
    <Permissional permission={Permission.CHANGE_VOLUME}>
      <h2>Volume</h2>
      <Slider
        min={0}
        max={100}
        onChange={volumeCallback}
        value={volume.volume}
        tooltipVisible
        style={{ marginTop: '50px' }}
      />
      <StyledDivider />
    </Permissional>
  ) : (
    <Fragment />
  );
};
