import React, { useContext, useEffect } from "react";
import { ConfigurationContext } from "../../../core/context/Configuration";
import api from "../../../core/api/model";
import { useResource } from "react-request-hook";
import { ConnectProp, SetupStates } from "./SetupConnection";

export const TestIcbint = ({ setNextState }: ConnectProp) => {
  const [{ data, error, isLoading }, getICBINT] = useResource(api.getICBINT);
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
