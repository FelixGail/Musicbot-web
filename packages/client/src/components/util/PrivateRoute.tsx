import React, { FunctionComponent } from "react";
import { RouteProps, Route, Redirect } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { ConfigurationContext } from "../../core/context";

export const PrivateRoute: FunctionComponent<RouteProps> = ({
  component,
  render,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps) => (
        <ConfigurationContext.Consumer>
          {value =>
            value.configuration.loggedIn ? (
              props.match ? (
                component ? (
                  React.createElement(component, props)
                ) : render ? (
                  render(props)
                ) : null
              ) : null
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: props.location }
                }}
              />
            )
          }
        </ConfigurationContext.Consumer>
      )}
    />
  );
};
