import { Song } from "../../../core/types";
import { useContext } from "react";
import { ConfigurationContext } from "../../../core/context/Configuration";
import React from "react";
import unknown_cover from "../../../img/unknown_cover.svg";

export const AlbumArt = ({
  song,
  ...props
}: { song?: Song } & React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) => {
  const config = useContext(ConfigurationContext);
  return (
    <img
      alt="cover"
      className="album-art"
      src={
        song && song.albumArtPath
          ? `${config.configuration.axios.defaults.baseURL}${song.albumArtPath}`
          : song && song.albumArtUrl
          ? song.albumArtUrl
          : unknown_cover
      }
      {...props}
    />
  );
};
