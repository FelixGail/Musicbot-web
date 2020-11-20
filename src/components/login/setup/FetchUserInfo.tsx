import React, { useEffect, useContext } from "react";
import { useUserFetch } from "../../../core/hooks/user";
import { ConnectionSetupContext, SetupStates } from "../../../core/context/ConnectionSetupContext";

export const FetchUserInfo = () => {
  const { setNextState } = useContext(ConnectionSetupContext);
  const [{ successful, isLoading, error }, fetch] = useUserFetch();
  useEffect(() => {
    const cancel = fetch();
    return () => cancel && cancel();
  }, [fetch]);
  useEffect(() => {
    if (!isLoading) {
      if (successful) {
        setNextState(SetupStates.DONE);
      }
      else if (error) {
        setNextState(SetupStates.FAILED);
      }
    }
  }, [isLoading, successful, error, setNextState]);
  return <h1>Fetching user info</h1>;
};

