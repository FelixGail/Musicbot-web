import {
  VersionInfo,
  Token,
  PlayerState,
  Action,
  UserInfo,
  NamedPlugin,
  Song,
  SongEntry,
  Volume,
  BotInstance,
  TokenWithRefresh,
} from "../types";
import { request, Arguments } from "react-request-hook";
import { AxiosRequestConfig } from "axios";

export interface RequestConfig<T> extends AxiosRequestConfig {}

type HookReturn<T> = T extends (...args: any[]) => RequestConfig<infer S>
  ? S
  : any;

export function getHookRequest<
  S extends (...args: any[]) => RequestConfig<any>
>(config: S) {
  return (...args: Arguments<S>) => request<HookReturn<S>>(config(...args));
}

const Operations = {
  getVersion: (): RequestConfig<VersionInfo> => ({
    method: "GET",
    url: "/version",
  }),
  exit: (): RequestConfig<void> => ({
    url: "/exit",
    method: "POST",
  }),
  getICBINT: (): RequestConfig<string> => ({
    method: "GET",
    url: "/icbint",
  }),
  registerUser: (username: string, userId: string): RequestConfig<Token> => ({
    url: "/user",
    method: "POST",
    data: {
      name: username,
      userId: userId,
    },
  }),
  getMe: (): RequestConfig<UserInfo> => ({
    url: "/user",
    method: "GET",
  }),
  setPassword: (password: string): RequestConfig<Token> => ({
    url: "/user",
    method: "PUT",
    data: {
      newPassword: password,
    },
  }),
  deleteUser: (): RequestConfig<void> => ({
    url: "/user",
    method: "DELETE",
  }),
  loginUser: (
    username: string,
    password: string,
    includeRefresh?: boolean
  ): RequestConfig<Token> => ({
    url: "/token",
    method: "GET",
    headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` },
    params: {
      includeRefresh: includeRefresh,
    },
  }),
  refreshUser: (
    token: TokenWithRefresh,
    includeNewToken?: boolean
  ): RequestConfig<Token> => ({
    url: "/token",
    method: "GET",
    headers: { Authorization: `Bearer ${token.refreshToken}` },
    params: {
      includeRefresh: includeNewToken,
    },
  }),
  deleteToken: (): RequestConfig<void> => ({
    url: "/token",
    method: "DELETE",
  }),
  getPlayerState: (): RequestConfig<PlayerState> => ({
    url: "/player",
    method: "GET",
  }),
  setPlayerState: (action: Action): RequestConfig<PlayerState> => ({
    url: "/player",
    method: "PUT",
    data: {
      action: action,
    },
  }),
  getHistory: (): RequestConfig<SongEntry[]> => ({
    url: "/player/queue/history",
    method: "GET",
  }),
  getQueue: (): RequestConfig<SongEntry[]> => ({
    url: "/player/queue",
    method: "GET",
  }),
  enqueue: (song: Song): RequestConfig<SongEntry[]> => ({
    url: "/player/queue",
    method: "PUT",
    params: {
      songId: song.id,
      providerId: song.provider.id,
    },
  }),
  dequeue: (song: Song): RequestConfig<SongEntry[]> => ({
    url: "/player/queue",
    method: "DELETE",
    params: {
      songId: song.id,
      providerId: song.provider.id,
    },
  }),
  moveEntry: (index: number, song: Song): RequestConfig<SongEntry[]> => ({
    url: "/player/queue/order",
    method: "PUT",
    params: {
      index: index,
      songId: song.id,
      providerId: song.provider.id,
    },
  }),
  getProviders: (): RequestConfig<NamedPlugin[]> => ({
    url: "/provider",
    method: "GET",
  }),
  lookupSong: (songId: string, provider: NamedPlugin): RequestConfig<Song> => ({
    url: `/provider/${provider.id}/${songId}`,
    method: "GET",
  }),
  search: (
    provider: NamedPlugin,
    query: string,
    limit?: number,
    offset?: number
  ): RequestConfig<Song[]> => ({
    url: `/provider/${provider.id}`,
    method: "GET",
    params: {
      query: query,
      limit: limit,
      offset: offset,
    },
  }),
  getSuggesters: (): RequestConfig<NamedPlugin[]> => ({
    url: "/suggester",
    method: "GET",
  }),
  getSuggestions: (
    suggester: NamedPlugin,
    max?: number
  ): RequestConfig<Song[]> => ({
    url: `/suggester/${suggester.id}`,
    method: "GET",
    params: {
      max: max,
    },
  }),
  removeSuggestion: (
    suggester: NamedPlugin,
    song: Song,
    provider: NamedPlugin
  ): RequestConfig<void> => ({
    url: `/suggester/${suggester.id}`,
    method: "DELETE",
    params: {
      songId: song.id,
      providerId: provider.id,
    },
  }),
  getVolume: (): RequestConfig<Volume> => ({
    url: "/volume",
    method: "GET",
  }),
  setVolume: (volume: number): RequestConfig<Volume> => ({
    url: "/volume",
    method: "PUT",
    params: {
      value: volume,
    },
  }),
  getInstances: (registryUrl: string): RequestConfig<BotInstance[]> => ({
    url: registryUrl,
    method: "GET",
  }),
};

export default Operations;
