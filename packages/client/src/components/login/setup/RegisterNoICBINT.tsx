import React, { useEffect } from "react";
import { useUserRegister } from "../../../core/user/user";
import { Canceler } from "axios";
import { ConnectProp, SetupStates } from "./SetupConnection";

export const RegisterNoICBINT = ({ setNextState }: ConnectProp) => {
  const [{ successful, isLoading, error }, register] = useUserRegister();

  useEffect(() => {
    const username = localStorage.getItem("username");
    let cancel: Canceler;
    if (username) {
      cancel = register(username, undefined);
    }
    else {
      setNextState(SetupStates.FAILED);
    }
    return () => cancel && cancel();
  }, [register, setNextState]);
  useEffect(() => {
    if (!isLoading) {
      if (successful) {
        setNextState(SetupStates.FETCH_USER_INFO);
      }
      else if (error) {
        setNextState(SetupStates.FAILED);
      }
    }
  }, [isLoading, successful, error, setNextState]);
  return <h1>Registering as new User</h1>;
};
