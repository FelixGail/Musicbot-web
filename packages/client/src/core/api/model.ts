import { VersionInfo, Token, PlayerState, Action, UserInfo } from "../types";
import { request } from "react-request-hook";

const api = {
  getVersion: () => {
    return request<VersionInfo>({
      method: "GET",
      url: "/version"
    });
  },
  getICBINT: () => {
    return request<string>({
      method: "GET",
      url: "/icbint"
    });
  },
  registerUser: (username: string, userId: string) => {
    return request<Token>({
      url: "/user",
      method: "POST",
      data: {
        name: username,
        userId: userId
      }
    });
  },
  loginUser: (username: string, password: string) => {
    return request<Token>({
      url: "/token",
      method: "GET",
      headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` }
    });
  },
  getMe: () => {
    return request<UserInfo>({
      url: "user",
      method: "GET"
    });
  },
  getPlayerState: () => {
    return request<PlayerState>({
      url: "/player",
      method: "GET"
    });
  },
  setPlayerState: (action: Action) => {
    return request<PlayerState>({
      url: "player",
      method: "PUT",
      data: {
        action: action
      }
    });
  }
};

export default api;
