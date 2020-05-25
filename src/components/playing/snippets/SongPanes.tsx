import React, { useEffect } from "react";
import { useResource } from "react-request-hook";
import api from "../../../core/api/model";
import { NamedPlugin, Song, Permission } from "../../../core/types";
import { SongList } from "./songlist/SongList";
import { ListProps } from "antd/lib/list";
import useResourceWithPermission from "../../../core/api/permissionWrapperHook";
import { useCallback } from "react";

const SongPane = ({
  songs,
  ...props
}: {
  songs?: Song[];
} & ListProps<Song>) => {
  const [, enqueue] = useResourceWithPermission(
    api.enqueue,
    Permission.ENQUEUE
  );
  const callback = useCallback((song: Song) => enqueue([], song) && true, [
    enqueue,
  ]);

  return <SongList items={songs} onClick={callback} {...props} />;
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