import { Song } from "../../../core/types";
import {
  IConfiguration,
  ConfigurationContext,
} from "../../../core/context/Configuration";
import React, { useContext, useMemo } from "react";
import unknown_cover from "../../../img/unknown_cover.svg";
import styled from "styled-components";

export const urlFromSong = (config: IConfiguration, song?: Song) =>
  song && song.albumArtPath
    ? `${config.axios.defaults.baseURL}${song.albumArtPath}`
    : song && song.albumArtUrl
    ? song.albumArtUrl
    : unknown_cover;

export const BackgroundAlbumArt = styled.div`
  position: absolute;
  left: 7%;
  top: 7%;
  right: 7%;
  bottom: 7%;
  background-image: url("${({
    song,
    config,
  }: {
    song: Song;
    config: IConfiguration;
  }) => urlFromSong(config, song)}");
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
>) => {
  const { configuration } = useContext(ConfigurationContext);
  const jsx = useMemo(
    () => (
      <img
        className={props.className}
        alt="cover"
        src={urlFromSong(configuration, song)}
      />
    ),
    [configuration, song, props.className]
  );
  return jsx;
};
