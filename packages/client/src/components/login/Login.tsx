import React, { useState, useMemo, useCallback } from "react";
import { Route, RouteComponentProps, Redirect } from "react-router";
import { Row, Col, Alert } from "antd";
import ReactSVG from "react-svg";
import logo from "../../img/kiu.svg";
import { LoginContext } from "../../core/context";
import { SetupConnection } from "./SetupConnection";
import { VerifyFingerprint } from "./VerifyFingerprint";
import { IdenticonModal } from "./IdenticonModal";
import { LoginForm } from "./LoginForm";

export const Login = (props: RouteComponentProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [redirectToReferrer, setRedirectToReferrer] = useState<boolean>(false);
  const error = useCallback(
    (error: string | null) => {
      setErrorMessage(error);
    },
    [setErrorMessage]
  );
  const redirect = useCallback(() => {
    setRedirectToReferrer(true);
  }, [setRedirectToReferrer]);

  const { from } = useMemo(
    () => props.location.state || { from: { pathname: "/" } },
    [props.location.state]
  );

  const provider = useMemo(() => {
    return {
      setError: error,
      redirectToReferrer: redirect
    };
  }, [error, redirect]);

  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }

  return (
    <div className="Login">
      <LoginContext.Provider value={provider}>
        <Row>
          <Col offset={8} span={8}>
            <ReactSVG
              src={logo}
              className="image centered"
              id="loginLogo"
            ></ReactSVG>
          </Col>
        </Row>
        {errorMessage && (
          <Row>
            <Col offset={6} span={12}>
              <Alert message={errorMessage} type="warning" />
            </Col>
          </Row>
        )}
        <Route exact path="*/login" component={SetupConnection} />
        <Route path="*/login/verify" component={VerifyFingerprint} />
        <Route
          path="*/login/verify/:id"
          render={({ match, history }) => IdenticonModal(match, history)}
        />
        <Route path="*/login/user" component={LoginForm} />
      </LoginContext.Provider>
    </div>
  );
};
