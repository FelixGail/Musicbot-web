import React, { useMemo } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { PrivateRoute } from "./util/PrivateRoute";
import { Login } from "./login/Login";
import { CurrentlyPlaying } from "./playing/CurrentlyPlaying";
import {
  ConfigurationContext,
  IConfiguration,
  IConfigurationContext
} from "../core/context";
import Axios from "axios";
import { RequestContext } from "react-request-hook";
import { useSetState } from "react-use";
import "./style/style.scss";

const App = () => {
  const axios = useMemo(
    () =>
      Axios.create({
        timeout: 1000,
        baseURL: "/api"
      }),
    []
  );

  const [configuration, setConfiguration] = useSetState<IConfiguration>({
    loggedIn: false,
    axios: axios
  });

  const configurationContext = useMemo<IConfigurationContext>(() => {
    return {
      configuration,
      setConfiguration
    };
  }, [configuration, setConfiguration]);

  return (
    <div className="App">
      <ConfigurationContext.Provider value={configurationContext}>
        <RequestContext.Provider value={axios}>
          <Router>
            <PrivateRoute
              exact
              path="/"
              component={() => <Redirect to="listen" />}
            />
            <PrivateRoute path="/listen" component={CurrentlyPlaying} />
            <Route path="/login" component={Login}></Route>
          </Router>
        </RequestContext.Provider>
      </ConfigurationContext.Provider>
    </div>
  );
};

export default App;
