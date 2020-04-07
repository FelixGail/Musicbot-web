export class ServiceError extends Error {
  code: number;
  data: any;

  constructor(code: number, data: any) {
    super();
    this.code = code;
    this.data = data;
  }
}

export interface PlayerState {
  state: PlayerStatus;
  songEntry?: SongEntry;
  progress?: number;
}

export function playerStateEquals(a?: PlayerState, b?: PlayerState) {
  if (a === b) return true;
  if (a && b) {
    return (
      a.state === b.state &&
      a.progress === b.progress &&
      songEntryEquals(a.songEntry, b.songEntry)
    );
  }
  return false;
}

export interface UserInfo {
  name: string;
  permissions: Permission[];
}

export interface ImplementationInfo {
  name: string;
  version: string;
  projectInfo: string;
}

export interface VersionInfo {
  apiVersion: string;
  implementation: ImplementationInfo;
}

export interface NamedPlugin {
  id: string;
  name: string;
}

export function namedPluginEquals(a?: NamedPlugin, b?: NamedPlugin) {
  if (a === b) return true;
  if (a && b) {
    return a.id === b.id;
  }
  return false;
}

export interface Song {
  id: string;
  provider: NamedPlugin;
  title: string;
  description: string;
  duration?: number;
  albumArtUrl?: string;
  albumArtPath?: string;
}

export function songEquals(a?: Song, b?: Song) {
  return (
    a === b ||
    (a && b && a.id === b.id && namedPluginEquals(a.provider, b.provider)) ||
    false
  );
}

export interface SongEntry {
  song: Song;
  userName: string;
}

export function songEntryEquals(a?: SongEntry, b?: SongEntry) {
  if (a === b) return true;
  if (a && b) {
    return a.userName === b.userName && songEquals(a.song, b.song);
  }
  return false;
}

export interface PlayerStateChange {
  action: Action;
}

export interface RegisterCredentials {
  name: string;
  userId: string;
}

export interface PasswordChange {
  newPassword: string;
}

export interface AuthExpectation {
  format: AuthFormat;
  type: UserType;
  permissions: Permission[];
}

export interface Volume {
  volume: number;
  isSupported: boolean;
}

export enum UserType {
  GUEST = "Guest",
  FULL = "Full",
}

export enum AuthFormat {
  TOKEN = "Token",
  BASIC = "Basic",
}

export enum Action {
  PLAY = "PLAY",
  PAUSE = "PAUSE",
  SKIP = "SKIP",
}

export enum PlayerStatus {
  PLAY = "PLAY",
  PAUSE = "PAUSE",
  STOP = "STOP",
  ERROR = "ERROR",
}

export enum Permission {
  SKIP = "SKIP",
  DISLIKE = "DISLIKE",
  MOVE = "MOVE",
  PAUSE = "PAUSE",
  ENQUEUE = "ENQUEUE",
  ALTER_SUGGESTIONS = "ALTER_SUGGESTIONS",
  CHANGE_VOLUME = "CHANGE_VOLUME",
  EXIT = "EXIT",
}

export interface Credentials {
  username: string;
  password: string;
  token: string;
}

export interface AdvancedToken {
  accessToken: string;
  refreshToken: string | null;
}

export type Token = string;
