import React, { useMemo, useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { PrivateRoute } from "./util/PrivateRoute";
import { Login } from "./login/Login";
import {
  ConfigurationContext,
  IConfiguration,
  IConfigurationContext
} from "../core/context/Configuration";
import Axios from "axios";
import { RequestContext } from "react-request-hook";
import { useSetState } from "react-use";
import "./style/style.scss";
import { PlayRouter } from "./playing/PlayRouter";
import { LikedSongContext } from "../core/context/LikedSongsContext";
import LikedSongs from "../core/LikedSongs";

const App = () => {
  const axios = useMemo(
    () =>
      Axios.create({
        timeout: 1000,
        baseURL: "/api"
      }),
    []
  );
  const [likedSongs] = useState(new LikedSongs());
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
        <LikedSongContext.Provider value={likedSongs}>
          <RequestContext.Provider value={axios}>
            <Router>
              <PrivateRoute
                exact
                path="/"
                component={() => <Redirect to="listen" />}
              />
              <PrivateRoute path="/listen" component={PlayRouter} />
              <Route path="/login" component={Login}></Route>
            </Router>
          </RequestContext.Provider>
        </LikedSongContext.Provider>
      </ConfigurationContext.Provider>
    </div>
  );
};

export default App;
