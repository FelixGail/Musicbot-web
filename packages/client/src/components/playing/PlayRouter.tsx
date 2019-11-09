import React from "react";
import { CurrentlyPlaying } from "./CurrentlyPlaying";
import { Route } from "react-router";
import SearchRouter from "./SearchRouter";

export const PlayRouter = () => {
  return (
    <div>
      <Route exact path="/listen" component={CurrentlyPlaying} />
      <Route path="*/add" component={SearchRouter} />
    </div>
  );
};
