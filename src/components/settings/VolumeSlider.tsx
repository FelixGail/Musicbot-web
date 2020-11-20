import { Slider } from 'antd';
import React, { Fragment, useCallback } from 'react';
import { useResource } from 'react-request-hook';
import { useResourceReload } from '../../core/hooks/resourceReloadHook';
import Operations from '../../core/rest/operations';
import { Permission } from '../../core/types';
import Permissional from '../util/Permissional';
import { StyledDivider } from "./Styles";

export const VolumeSlider = () => {
    const volume = useResourceReload(Operations.getVolume, { volume: 0, isSupported: false }, 1000, false);
    const [, setVolume] = useResource(Operations.setVolume);

    const volumeCallback = useCallback((value: number) => {
        setVolume(value);
    }, [setVolume]);

    return volume.isSupported ? <Permissional permission={Permission.CHANGE_VOLUME}>
        <h2>Volume</h2>
        <Slider
            min={0}
            max={100}
            onChange={volumeCallback}
            value={volume.volume}
            tooltipVisible
            style={{ marginTop: '50px' }} />
        <StyledDivider />
    </Permissional> : <Fragment />;
};
