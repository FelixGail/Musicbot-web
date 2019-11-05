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

export interface Song {
  id: string;
  provider: NamedPlugin;
  title: string;
  description: string;
  duration?: number;
  albumArtUrl?: string;
  albumArtPath?: string;
}

export interface SongEntry {
  song: Song;
  userName: string;
}

export interface QueueEntry {
  song: Song;
  userName: string;
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
  FULL = "Full"
}

export enum AuthFormat {
  TOKEN = "Token",
  BASIC = "Basic"
}

export enum Action {
  PLAY = "PLAY",
  PAUSE = "PAUSE",
  SKIP = "SKIP"
}

export enum PlayerStatus {
  PLAY = "PLAY",
  PAUSE = "PAUSE",
  STOP = "STOP",
  ERROR = "ERROR"
}

export enum Permission {
  SKIP = "skip",
  DISLIKE = "dislike",
  MOVE = "move",
  PAUSE = "pause",
  ENQUEUE = "enqueue",
  ALTER_SUGGESTIONS = "alter_suggestions",
  CHANGE_VOLUME = "change_volume",
  EXIT = "exit"
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
