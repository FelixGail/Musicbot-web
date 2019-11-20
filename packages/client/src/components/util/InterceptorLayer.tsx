import { useContext, useEffect } from "react";
import { ConfigurationContext } from "../../core/context/Configuration";
import { usePerformLogin } from "../../core/api/loginHook";
import { RequestError } from "react-request-hook";
import { AxiosError } from "axios";

export interface InterceptorLayerProps {
  children?: JSX.Element;
}

const InterceptorLayer = (props: InterceptorLayerProps) => {
  const { configuration } = useContext(ConfigurationContext);
  const [result, login] = usePerformLogin();

  useEffect(() => {
    const id = configuration.axios.interceptors.response.use(
      value => value,
      (error: AxiosError) => {
        if (
          configuration.username &&
          error.response &&
          error.response.status === 401
        ) {
          login(configuration.username, configuration.password || null);
        }
      }
    );
    return () => configuration.axios.interceptors.response.eject(id);
  }, [
    configuration.axios,
    configuration.username,
    configuration.password,
    login
  ]);
  return props.children || null;
};

export default InterceptorLayer;
