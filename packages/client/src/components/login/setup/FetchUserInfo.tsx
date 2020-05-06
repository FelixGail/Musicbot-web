import React, { useEffect } from "react";
import { useUserFetch } from "../../../core/user/user";
import { ConnectProp, SetupStates } from "./SetupConnection";
export const FetchUserInfo = ({ setNextState }: ConnectProp) => {
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
export const LoginICBINT = (props: ConnectProp) => {
  return <h1>Not Implemented</h1>;
};
