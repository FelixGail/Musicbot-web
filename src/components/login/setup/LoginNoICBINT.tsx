import React, { useEffect, useContext } from 'react';
import { useUserRefresh } from '../../../core/hooks/user';
import { ConfigurationContext } from '../../../core/context/Configuration';
import { TokenWithRefresh } from '../../../core/types';
import {
  ConnectionSetupContext,
  SetupStates,
} from '../../../core/context/ConnectionSetupContext';

export const LoginNoICBINT = (): JSX.Element => {
  const { setNextState } = useContext(ConnectionSetupContext);

  const [{ successful, error, isLoading }, login] = useUserRefresh();
  const { configuration, setConfiguration } = useContext(ConfigurationContext);

  useEffect(() => {
    if (configuration.instance) {
      const refreshToken = localStorage.getItem(configuration.instance.domain);
      if (refreshToken) {
        const token: TokenWithRefresh = { accessToken: '', refreshToken };
        setConfiguration({ token: token });
        const cancel = login(token);
        return () => cancel && cancel();
      } else {
        setNextState(SetupStates.REGISTER_NO_ICBINT);
      }
    } else {
      setNextState(SetupStates.FETCH_INSTANCES);
    }
  }, [configuration.instance, login, setNextState, setConfiguration]);

  useEffect(() => {
    if (!isLoading) {
      if (successful) {
        setNextState(SetupStates.FETCH_USER_INFO);
      } else if (error) {
        if (error.code && +error.code === 401) {
          setNextState(SetupStates.REGISTER_NO_ICBINT);
        } else {
          setNextState(SetupStates.FAILED);
        }
      }
    }
  }, [successful, isLoading, error, setNextState]);
  return <h1>Logging in with saved credentials</h1>;
};
