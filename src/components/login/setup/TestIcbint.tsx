import React, { useContext, useEffect } from "react";
import { ConfigurationContext } from "../../../core/context/Configuration";
import Operations, { getHookRequest } from "../../../core/rest/operations";
import { useResource } from "react-request-hook";
import { ConnectionSetupContext, SetupStates } from "../../../core/context/ConnectionSetupContext";

export const TestIcbint = () => {
  const { setNextState } = useContext(ConnectionSetupContext);
  const [{ data, error, isLoading }, getICBINT] = useResource(getHookRequest(Operations.getICBINT));
  const { setConfiguration } = useContext(ConfigurationContext);
  useEffect(() => {
    const cancel = getICBINT();
    return () => cancel();
  }, [getICBINT]);
  useEffect(() => {
    if (!isLoading) {
      if (data) {
        setConfiguration({ icbintKey: data });
        setNextState(SetupStates.LOGIN_ICBINT);
      }
      else {
        setNextState(SetupStates.LOGIN_NO_ICBINT);
      }
    }
  }, [isLoading, data, error, setNextState, setConfiguration]);
  return <h1>Checking for ICBINT</h1>;
};
