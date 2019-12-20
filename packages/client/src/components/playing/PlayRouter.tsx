import React from "react";
import { ListenRouter } from "./listen/ListenRouter";
import { Route } from "react-router";
import SearchRouter from "./add/SearchRouter";
import { useLogger } from "react-use";

export const PlayRouter = () => {
  useLogger("PlayRouter");
  return (
    <div>
      <Route path="*/listen" component={ListenRouter} />
      <Route path="*/add" component={SearchRouter} />
    </div>
  );
};
