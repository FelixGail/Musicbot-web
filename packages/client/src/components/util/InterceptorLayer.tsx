import React, {
  useContext,
  useEffect,
  Fragment,
  FunctionComponent,
} from "react";
import { ConfigurationContext } from "../../core/context/Configuration";
import { AxiosError } from "axios";
import { useUserRefresh } from "../../core/user/user";
import { hasRefreshToken } from "../../core/types";

const InterceptorLayer: FunctionComponent = ({ children }) => {
  const { configuration } = useContext(ConfigurationContext);
  const [, login] = useUserRefresh();

  useEffect(() => {
    const id = configuration.axios.interceptors.response.use(
      (value) => value,
      (error: AxiosError) => {
        console.log("intercepted error: ", error);
        if (
          configuration.token &&
          hasRefreshToken(configuration.token) &&
          configuration.loggedIn &&
          error.response &&
          error.response.status === 401
        ) {
          login(configuration.token);
        }
        return Promise.reject(error);
      }
    );
    return () => configuration.axios.interceptors.response.eject(id);
  }, [
    configuration.axios,
    configuration.token,
    configuration.loggedIn,
    login,
  ]);
  return <Fragment>{children}</Fragment>;
};

export default InterceptorLayer;
