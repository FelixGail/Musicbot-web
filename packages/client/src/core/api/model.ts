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
} from "../types";
import { request } from "react-request-hook";

const api = {
  getVersion: () => {
    return request<VersionInfo>({
      method: "GET",
      url: "/version",
    });
  },
  exit: () => {
    return request<void>({
      url: "/exit",
      method: "POST",
    });
  },
  getICBINT: () => {
    return request<string>({
      method: "GET",
      url: "/icbint",
    });
  },
  registerUser: (username: string, userId: string) => {
    return request<Token>({
      url: "/user",
      method: "POST",
      data: {
        name: username,
        userId: userId,
      },
    });
  },
  getMe: () => {
    return request<UserInfo>({
      url: "/user",
      method: "GET",
    });
  },
  setPassword: (password: string) => {
    return request<Token>({
      url: "/user",
      method: "PUT",
      data: {
        newPassword: password,
      },
    });
  },
  deleteUser: () => {
    return request<void>({
      url: "/user",
      method: "DELETE",
    });
  },
  loginUser: (username: string, password: string) => {
    return request<Token>({
      url: "/token",
      method: "GET",
      headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` },
    });
  },
  deleteToken: () => {
    return request<void>({
      url: "/token",
      method: "DELETE",
    });
  },
  getPlayerState: () => {
    return request<PlayerState>({
      url: "/player",
      method: "GET",
    });
  },
  setPlayerState: (action: Action) => {
    return request<PlayerState>({
      url: "/player",
      method: "PUT",
      data: {
        action: action,
      },
    });
  },
  getHistory: () => {
    return request<SongEntry[]>({
      url: "/player/queue/history",
      method: "GET",
    });
  },
  getQueue: () => {
    return request<SongEntry[]>({
      url: "/player/queue",
      method: "GET",
    });
  },
  enqueue: (song: Song) => {
    return request<SongEntry[]>({
      url: "/player/queue",
      method: "PUT",
      params: {
        songId: song.id,
        providerId: song.provider.id,
      },
    });
  },
  dequeue: (song: Song) => {
    return request<SongEntry[]>({
      url: "/player/queue",
      method: "DELETE",
      params: {
        songId: song.id,
        providerId: song.provider.id,
      },
    });
  },
  moveEntry: (index: number, song: Song) => {
    return request<SongEntry[]>({
      url: "/player/queue/order",
      method: "PUT",
      params: {
        index: index,
        songId: song.id,
        providerId: song.provider.id,
      },
    });
  },
  getProviders: () => {
    return request<NamedPlugin[]>({
      url: "/provider",
      method: "GET",
    });
  },
  lookupSong: (songId: string, provider: NamedPlugin) => {
    return request<Song>({
      url: `/provider/${provider.id}/${songId}`,
      method: "GET",
    });
  },
  search: (
    provider: NamedPlugin,
    query: string,
    limit?: number,
    offset?: number
  ) => {
    return request<Song[]>({
      url: `/provider/${provider.id}`,
      method: "GET",
      params: {
        query: query,
        limit: limit,
        offset: offset,
      },
    });
  },
  getSuggesters: () => {
    return request<NamedPlugin[]>({
      url: "/suggester",
      method: "GET",
    });
  },
  getSuggestions: (suggester: NamedPlugin, max?: number) => {
    return request<Song[]>({
      url: `/suggester/${suggester.id}`,
      method: "GET",
      params: {
        max: max,
      },
    });
  },
  removeSuggestion: (
    suggester: NamedPlugin,
    song: Song,
    provider: NamedPlugin
  ) => {
    return request<void>({
      url: `/suggester/${suggester.id}`,
      method: "DELETE",
      params: {
        songId: song.id,
        providerId: provider.id,
      },
    });
  },
  getVolume: () => {
    return request<Volume>({
      url: "/volume",
      method: "GET",
    });
  },
  setVolume: (volume: number) => {
    return request<Volume>({
      url: "/volume",
      method: "PUT",
      params: {
        value: volume,
      },
    });
  },
};

export default api;
