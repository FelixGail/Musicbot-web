import { Song } from "../../core/types";
import { useContext } from "react";
import { ConfigurationContext } from "../../core/context";
import React from "react";
import unknown_cover from "../../img/unknown_cover.svg";

export const AlbumArt = (props: {song?: Song}) => {
    const config = useContext(ConfigurationContext);
    const song = props.song
    return <img alt="cover" className="album-art" src={
        song && song.albumArtPath?
            `${config.configuration.axios.defaults.baseURL}${song.albumArtPath}`
            : song && song.albumArtUrl?
                song.albumArtUrl
                : unknown_cover
    }/>
}