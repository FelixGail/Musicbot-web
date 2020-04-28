import React, { useEffect } from "react";
import { useUserLogin } from "../../../core/user/user";
import { ConnectProp, SetupStates } from "./SetupConnection";

export const LoginNoICBINT = ({ setNextState }: ConnectProp) => {
  const [{ successful, error, isLoading }, login] = useUserLogin();
  useEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (username) {
      if (password) {
        const cancel = login(username, password);
        return () => cancel && cancel();
      }
      else {
        setNextState(SetupStates.REGISTER_NO_ICBINT);
      }
    }
    else {
      setNextState(SetupStates.FAILED);
    }
  }, [setNextState, login]);
  useEffect(() => {
    if (!isLoading) {
      if (successful) {
        setNextState(SetupStates.FETCH_USER_INFO);
      }
      else if (error) {
        if (error.code && +error.code === 401) {
          setNextState(SetupStates.REGISTER_NO_ICBINT);
        }
        else {
          setNextState(SetupStates.FAILED);
        }
      }
    }
  }, [successful, isLoading, error, setNextState]);
  return <h1>Logging in with saved credentials</h1>;
};
