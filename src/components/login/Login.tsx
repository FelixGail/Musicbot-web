import React, { useState, useMemo, useCallback } from "react";
import { Route, RouteComponentProps } from "react-router";
import { Row, Col, Alert } from "antd";
import { ReactSVG } from "react-svg";
import logo from "../../resources/img/kiu.svg";
import { LoginContext } from "../../core/context/LoginContext";
import { SetupConnection } from "./setup/SetupConnection";
import { LoginForm } from "./LoginForm";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

export const Login = (props: RouteComponentProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const location = useLocation<{from?: { pathname?: string}}>();
  
  const error = useCallback(
    (error: string | null) => {
      setErrorMessage(error);
    },
    [setErrorMessage]
  );

  const from = useMemo(
    () => (location.state && location.state.from && location.state.from.pathname && location.state.from.pathname) || "/",
    [location.state]
  );

  const provider = useMemo(() => {
    return {
      setError: error,
      redirect: from
    };
  }, [error, from]);

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
        fill: rgba(217, 217, 217, 0.753);
      }
    }
  }

  .ant-row {
    padding-top: 1%;
  }
`;
