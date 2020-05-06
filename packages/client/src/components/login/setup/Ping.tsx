import React, { useEffect } from "react";
import api from "../../../core/api/model";
import { useResource } from "react-request-hook";
import { ConnectProp, SetupStates } from "./SetupConnection";

export const Ping = ({ setNextState }: ConnectProp) => {
  const [{ data, error }, getVersion] = useResource(api.getVersion);
  useEffect(() => {
    const cancel = getVersion();
    return () => cancel();
  }, [getVersion]);
  useEffect(() => {
    if (data) {
      setNextState(SetupStates.TEST_ICBINT);
    }
    else if (error) {
      setTimeout(() => setNextState(SetupStates.FETCH_INSTANCES), 5000);
    }
  }, [error, data, setNextState, getVersion]);
  return <h1>Connecting to Server</h1>;
};
