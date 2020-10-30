import React, { useMemo } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { PrivateRoute } from "./util/PrivateRoute";
import { Login } from "./login/Login";
import {
  ConfigurationContext,
  IConfiguration,
  IConfigurationContext,
} from "../core/context/Configuration";
import Axios from "axios";
import { RequestContext } from "react-request-hook";
import { useSetState } from "react-use";
import { PlayRouter } from "./playing/PlayRouter";
import InterceptorLayer from "./util/InterceptorLayer";
import { Settings } from "./settings/Settings";

import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #272c35;
  }
`;

interface Config {
  registry: string;
}

const App = (props: ({config: Config})) => {
  const axios = useMemo(
    () =>
      Axios.create({
        timeout: 1000,
      }),
    []
  );
  const [configuration, setConfiguration] = useSetState<IConfiguration>({
    loggedIn: false,
    axios: axios,
    registryUrl: props.config.registry
  });

  const configurationContext = useMemo<IConfigurationContext>(() => {
    return {
      configuration,
      setConfiguration,
    };
  }, [configuration, setConfiguration]);

  return (
    <ConfigurationContext.Provider value={configurationContext}>
        <GlobalStyle />
        <RequestContext.Provider value={axios}>
          <InterceptorLayer>
            <Router>
              <PrivateRoute
                exact
                path="/"
                component={() => <Redirect to="listen" />}
              />
              <PrivateRoute path={["/listen", "/add"]} component={PlayRouter} />
              <PrivateRoute path="/settings" component={Settings} />
              <Route path="/login" component={Login}></Route>
            </Router>
          </InterceptorLayer>
        </RequestContext.Provider>
    </ConfigurationContext.Provider>
  );
};

export default App;
