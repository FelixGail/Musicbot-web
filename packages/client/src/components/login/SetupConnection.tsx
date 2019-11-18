import React, { useContext, useEffect, useState, useMemo } from "react";
import { RouteComponentProps, Redirect } from "react-router";
import { Row, Col } from "antd";
import { ConfigurationContext } from "../../core/context/Configuration";
import { LoginContext } from "../../core/context/LoginContext";
import api from "../../core/api/model";
import { usePerformLogin } from "../../core/api/loginHook";
import { useResource } from "react-request-hook";

enum SetupStates {
  PINGING,
  TEST_ICBINT,
  LOGIN_ICBINT,
  LOGIN_NO_ICBINT,
  FAILED_NO_ICBINT,
  FAILED_ICBINT,
  DONE
}

interface ConnectProp {
  setNextState: (nextState: SetupStates) => void;
}

export const SetupConnection = (props: RouteComponentProps) => {
  const [state, setState] = useState(SetupStates.PINGING);
  const loginContext = useContext(LoginContext);

  const switchState = useMemo(() => {
    switch (state) {
      case SetupStates.PINGING:
        return <Ping setNextState={setState} />;
      case SetupStates.TEST_ICBINT:
        return <TestIcbint setNextState={setState} />;
      case SetupStates.LOGIN_ICBINT:
        return <LoginICBINT setNextState={setState} />;
      case SetupStates.LOGIN_NO_ICBINT:
        return <LoginNoICBINT setNextState={setState} />;
      case SetupStates.FAILED_NO_ICBINT:
        return <Redirect to={`${props.location.pathname}/user`} />;
      case SetupStates.DONE:
        loginContext.redirectToReferrer();
    }
  }, [state, loginContext, props.location.pathname]);

  return (
    <Row>
      <Col offset={6} span={12}>
        {switchState}
      </Col>
    </Row>
  );
};

const Ping = ({ setNextState }: ConnectProp) => {
  const [{ data, error }, getVersion] = useResource(api.getVersion);
  useEffect(() => {
    getVersion();
  }, [getVersion]);

  useEffect(() => {
    if (data) {
      setNextState(SetupStates.TEST_ICBINT);
    } else {
      const cancel = setTimeout(() => {
        getVersion();
      }, 5000);
      return () => clearTimeout(cancel);
    }
  }, [error, data, setNextState, getVersion]);

  return <h1>Connecting to Server</h1>;
};

const TestIcbint = ({ setNextState }: ConnectProp) => {
  const [{ data, error, isLoading }, getICBINT] = useResource(api.getICBINT);
  const { setConfiguration } = useContext(ConfigurationContext);

  useEffect(() => getICBINT(), [getICBINT]);
  useEffect(() => {
    if (!isLoading) {
      if (data) {
        setConfiguration({ icbintKey: data });
        setNextState(SetupStates.LOGIN_ICBINT);
      } else {
        setNextState(SetupStates.LOGIN_NO_ICBINT);
      }
    }
  }, [isLoading, data, error, setNextState, setConfiguration]);
  return <h1>Checking for ICBINT</h1>;
};

const LoginNoICBINT = ({ setNextState }: ConnectProp) => {
  const [{ successful, error, isLoading }, login] = usePerformLogin();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (username) {
      login(username, password);
    } else {
      setNextState(SetupStates.FAILED_NO_ICBINT);
    }
  }, [setNextState, login]);

  useEffect(() => {
    if (!isLoading) {
      if (successful) {
        setNextState(SetupStates.DONE);
      } else if (error) {
        setNextState(SetupStates.FAILED_NO_ICBINT);
      }
    }
  }, [successful, isLoading, error, setNextState]);

  return <h1>Logging in with saved credentials</h1>;
};

const LoginICBINT = (props: ConnectProp) => {
  return <h1>Not Implemented</h1>;
};
