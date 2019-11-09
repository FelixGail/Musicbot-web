import React, { useEffect, useCallback, useState } from "react";
import { useResource } from "react-request-hook";
import api from "../../core/api/model";
import { NamedPlugin, Song } from "../../core/types";
import { SongList } from "./SongList";
import { ListProps } from "antd/lib/list";

const SongPane = ({
  songs,
  ...props
}: {
  songs?: Song[];
} & ListProps<Song>) => {
  const [, enqueue] = useResource(api.enqueue);
  const [mutableSongs, setSongs] = useState(songs);

  useEffect(() => setSongs(songs), [songs, setSongs]);

  const enqueueWrapper = useCallback(
    (song: Song) => {
      enqueue(song, song.provider);
      setSongs(mutableSongs && mutableSongs.filter(item => item !== song));
    },
    [enqueue, mutableSongs]
  );

  return <SongList songs={mutableSongs} onClick={enqueueWrapper} {...props} />;
};

export const ProviderPane = ({
  provider,
  query,
  ...props
}: {
  provider: NamedPlugin;
  query: string;
} & ListProps<Song>) => {
  const [songs, search] = useResource(api.search);

  useEffect(() => {
    search(provider, query);
  }, [search, provider, query]);

  return <SongPane songs={songs.data} {...props} />;
};

export const SuggesterPane = ({
  suggester,
  ...props
}: { suggester: NamedPlugin } & ListProps<Song>) => {
  const [songs, getSuggestions] = useResource(api.getSuggestions);

  useEffect(() => {
    getSuggestions(suggester);
  }, [getSuggestions, suggester]);

  return <SongPane songs={songs.data} {...props} />;
};
