import React, {
  useContext,
  useEffect,
  Fragment,
  FunctionComponent,
} from 'react';
import { ConfigurationContext } from '../../core/context/Configuration';
import { AxiosError } from 'axios';
import { useUserRefresh } from '../../core/hooks/user';
import { hasRefreshToken } from '../../core/types';

const InterceptorLayer: FunctionComponent = ({ children }) => {
  const { configuration } = useContext(ConfigurationContext);
  const [, login] = useUserRefresh();

  useEffect(() => {
    const id = configuration.axios.interceptors.response.use(
      (value) => value,
      (error: Error) => {
        console.log('intercepted error: ', error.message, error.stack);
        console.log(
          configuration.token,
          configuration.token && hasRefreshToken(configuration.token),
          error,
        );
        if ((error as AxiosError).isAxiosError) {
          const axiosError = error as AxiosError;
          if (
            configuration.token &&
            hasRefreshToken(configuration.token) &&
            configuration.loggedIn &&
            axiosError.response &&
            axiosError.response.status === 401
          ) {
            login(configuration.token);
          }
        }
        return Promise.reject(error);
      },
    );
    return () => configuration.axios.interceptors.response.eject(id);
  }, [configuration.axios, configuration.token, configuration.loggedIn, login]);
  return <Fragment>{children}</Fragment>;
};

export default InterceptorLayer;
