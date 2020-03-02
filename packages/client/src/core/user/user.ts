import { useResource, RequestError, Resource } from "react-request-hook";
import api from "../api/model";
import { useEffect, useState, useContext, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { ConfigurationContext } from "../context/Configuration";
import { Canceler } from "axios";

export interface CallResult {
  successful: boolean;
  isLoading: boolean;
  error?: RequestError;
}

function useGenericLogin(
  loginFunction: (username: string, userId: string) => Resource<string>
): [CallResult, (username: string, password: string) => Canceler] {
  const [{ data, error, isLoading }, login] = useResource(loginFunction);
  const [success, setSuccess] = useState<boolean>(false);
  const { configuration } = useContext(ConfigurationContext);
  const [state, setState] = useState<{ username: string; password: string }>();

  const callFunction = useCallback(
    (username: string, password: string) => {
      setState({ username: username, password: password });
      return login(username, password);
    },
    [login, setState]
  );

  useEffect(() => {
    if (data && !isLoading) {
      configuration.username = state?.username;
      configuration.password = state?.password;
      configuration.loggedIn = true;
      configuration.token = data;
      configuration.axios.defaults.headers.Authorization = `Bearer ${data}`;
      setSuccess(true);
    }
  }, [data, isLoading, configuration, state]);

  return [{ successful: success, isLoading, error }, callFunction];
}

export function useUserRegister(): [
  CallResult,
  (username: string, passowrd?: string) => Canceler
] {
  const [callresult, genericCall] = useGenericLogin(api.registerUser);
  const call = useCallback(
    (username: string, userId?: string) => {
      const password = userId || uuidv4();
      return genericCall(username, password);
    },
    [genericCall]
  );
  return [callresult, call];
}

export function useUserLogin(): [
  CallResult,
  (username: string, password: string) => Canceler
] {
  return useGenericLogin(api.loginUser);
}

export function useUserFetch(): [CallResult, () => Canceler] {
  const [{ data, error, isLoading }, getUser] = useResource(api.getMe);
  const [success, setSuccess] = useState<boolean>(false);
  const { configuration } = useContext(ConfigurationContext);

  useEffect(() => {
    if (data && !isLoading) {
      configuration.permissions = data.permissions;
      setSuccess(true);
    }
  }, [data, isLoading, setSuccess, configuration]);

  return [{ successful: success, isLoading, error }, getUser];
}

export function useUserSetPassword(): [
  CallResult,
  (password: string) => Canceler
] {
  const [{ data, error, isLoading }, setPassword] = useResource(
    api.setPassword
  );
  const [success, setSuccess] = useState<boolean>(false);
  const [passwordState, setStatePassword] = useState<string>();
  const { configuration } = useContext(ConfigurationContext);

  const callFunction = useCallback(
    (password: string) => {
      setStatePassword(password);
      return setPassword(password);
    },
    [setPassword, setStatePassword]
  );

  useEffect(() => {
    if (data && !isLoading) {
      configuration.password = passwordState;
      configuration.token = data;
      setSuccess(true);
    }
  }, [data, isLoading, setSuccess, configuration, passwordState]);

  return [{ successful: success, isLoading, error }, callFunction];
}
