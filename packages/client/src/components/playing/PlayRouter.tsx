import React from "react";
import { CurrentlyPlaying } from "./CurrentlyPlaying";
import { Route } from "react-router";
import { Search } from "./Search";

export const PlayRouter = () => {
  return (
    <div>
      <Route exact path="/listen" component={CurrentlyPlaying} />
      <Route path="*/search" component={Search} />
    </div>
  );
};
