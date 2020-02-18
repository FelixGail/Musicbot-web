import React, {
  useContext,
  useEffect,
  Fragment,
  FunctionComponent
} from "react";
import { ConfigurationContext } from "../../core/context/Configuration";
import { usePerformLogin } from "../../core/api/loginHook";
import { AxiosError } from "axios";

const InterceptorLayer: FunctionComponent = ({ children }) => {
  const { configuration } = useContext(ConfigurationContext);
  const [, login] = usePerformLogin();


  useEffect(() => {
    const id = configuration.axios.interceptors.response.use(
      value => value,
      (error: AxiosError) => {
        console.log("intercepted error: ", error)
        if (
          configuration.username &&
          configuration.password &&
          configuration.loggedIn &&
          error.response &&
          error.response.status === 401
        ) {
          login(configuration.username, configuration.password);
        }
        return Promise.reject(error)
      }
    );
    return () => configuration.axios.interceptors.response.eject(id);
  }, [
    configuration.axios,
    configuration.username,
    configuration.password,
    configuration.loggedIn,
    login
  ]);
  return <Fragment>
        {children}
    </Fragment>;
};

export default InterceptorLayer;
