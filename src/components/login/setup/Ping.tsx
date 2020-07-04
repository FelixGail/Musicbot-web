import React, { useEffect, useContext } from "react";
import api, { getHookRequest } from "../../../core/api/model";
import { useResource } from "react-request-hook";
import { ConnectionSetupContext, SetupStates } from "../../../core/context/ConnectionSetupContext";

export const Ping = () => {
  const { setNextState } = useContext(ConnectionSetupContext);
  const [{ data, error }, getVersion] = useResource(getHookRequest(api.getVersion));
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
