import React, { useState, useMemo, useCallback } from "react";
import { Route, RouteComponentProps, Redirect } from "react-router";
import { Row, Col, Alert } from "antd";
import { ReactSVG } from "react-svg";
import logo from "../../img/kiu.svg";
import { LoginContext } from "../../core/context/LoginContext";
import { SetupConnection } from "./setup/SetupConnection";
import { VerifyFingerprint } from "./VerifyFingerprint";
import { IdenticonModal } from "./IdenticonModal";
import { LoginForm } from "./LoginForm";
import styled from "styled-components";

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
      redirectToReferrer: redirect,
    };
  }, [error, redirect]);

  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }

  return (
    <StyledLogin>
      <LoginContext.Provider value={provider}>
        <Row>
          <Col offset={8} span={8}>
            <ReactSVG src={logo} id="loginLogo"></ReactSVG>
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
    </StyledLogin>
  );
};

const StyledLogin = styled.div`
  background-color: #272c35;
  min-height: 100vh;

  #loginLogo {
    max-width: 75%;
    min-width: 40%;
    position: relative;
    display: flex;
    height: calc(90vh / 3);
    margin-left: auto;
    margin-right: auto;
    display: block;

    svg {
      width: 100%;
      height: 100%;
      position: absolute;

      .logoColor2 {
        fill: #e5e5e5;
      }

      .label {
        fill: #3d4452;
      }
    }
  }

  .ant-row {
    padding-top: 1%;
  }
`;
