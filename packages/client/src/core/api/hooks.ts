import { useContext, useEffect, useCallback } from "react";
import { ConfigurationContext } from "../context";
import { useResource, RequestError } from "react-request-hook";
import { Token } from "../types";
import api from "./model";
import { Canceler } from "axios";
import { useSetState } from "react-use";
const uuid4 = require("uuid/v4");

interface LoginResult {
  successful: boolean;
  isLoading: boolean;
  error?: RequestError;
}

type LoginRequest = (username: string, password: string | null) => Canceler;

export function usePerformLogin(): [LoginResult, LoginRequest] {
  const { configuration, setConfiguration } = useContext(ConfigurationContext);
  const [loggedInUserToken, login] = useResource(api.loginUser);
  const [registeredUserToken, register] = useResource(api.registerUser);
  const [user, getUser] = useResource(api.getMe);
  const [state, setState] = useSetState<LoginResult>({
    isLoading: false,
    successful: false
  });

  const performLogin = useCallback(
    (username: string, password: string | null) => {
      const tmpPw: string = password ? password : uuid4();
      setConfiguration({ username: username, password: tmpPw });
      localStorage.setItem("username", username);
      localStorage.setItem("password", tmpPw);
      if (password) {
        return login(username, password);
      }
      return register(username, tmpPw);
    },
    [register, login, setConfiguration]
  );

  const postLogin = useCallback(
    (data?: Token, error?: RequestError) => {
      if (data) {
        configuration.axios.defaults.headers.Authorization = `Bearer ${data}`;
        setConfiguration({ token: data });
        getUser();
      }
      if (error) {
        setState({ successful: false, isLoading: false, error: error });
      }
    },
    [getUser, setConfiguration, setState, configuration.axios]
  );

  useEffect(() => {
    postLogin(registeredUserToken.data, registeredUserToken.error);
  }, [registeredUserToken.data, registeredUserToken.error, postLogin]);

  useEffect(() => {
    postLogin(loggedInUserToken.data, loggedInUserToken.error);
  }, [loggedInUserToken.data, loggedInUserToken.error, postLogin]);

  useEffect(() => {
    if (user.data && !user.isLoading) {
      setConfiguration({ permissions: user.data.permissions, loggedIn: true });
      setState({ successful: true, isLoading: false, error: undefined });
    }
  }, [user.data, user.error, setConfiguration, setState, user.isLoading]);

  return [state, performLogin];
}
