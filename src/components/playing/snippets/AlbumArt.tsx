import { Song } from '../../../core/types';
import {
  IConfiguration,
  ConfigurationContext,
} from '../../../core/context/Configuration';
import React, { useContext, useMemo, useState, useCallback } from 'react';
import unknown_cover from '../../../resources/img/unknown_cover.svg';
import styled from 'styled-components';

export const urlFromSong = (config: IConfiguration, song?: Song): string =>
  song && song.albumArtPath
    ? `${config.axios.defaults.baseURL}${song.albumArtPath}`
    : song && song.albumArtUrl
    ? song.albumArtUrl
    : unknown_cover;

export const BackgroundAlbumArt = styled.div<{
  song: Song;
  config: IConfiguration;
}>`
  position: absolute;
  left: 7%;
  top: 7%;
  right: 7%;
  bottom: 7%;
  background-image: url('${(props) => urlFromSong(props.config, props.song)}');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`;

export const AlbumArt = ({
  song,
  ...props
}: { song?: Song } & React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>): JSX.Element => {
  const { configuration } = useContext(ConfigurationContext);
  const [state, setState] = useState({
    errored: false,
    src: urlFromSong(configuration, song),
  });
  const onError = useCallback(() => {
    if (!state.errored) {
      setState({
        errored: true,
        src: (song && song.savedArt) || unknown_cover,
      });
    }
  }, [setState, state.errored, song]);
  const jsx = useMemo(
    () => (
      <img
        className={props.className}
        alt="cover"
        src={state.src}
        onError={onError}
      />
    ),
    [props.className, state.src, onError],
  );
  return jsx;
};
