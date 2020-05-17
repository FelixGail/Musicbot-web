import React, { useEffect, useContext } from "react";
import { useUserRegister } from "../../../core/user/user";
import { Canceler } from "axios";
import { ConnectionSetupContext, SetupStates } from "../../../core/context/ConnectionSetupContext";

export const RegisterNoICBINT = () => {
  const { setNextState } = useContext(ConnectionSetupContext);
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
