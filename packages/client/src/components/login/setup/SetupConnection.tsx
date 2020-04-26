import React, { useContext, useState, useMemo } from "react";
import { Redirect } from "react-router";
import { Row, Col } from "antd";
import { LoginContext } from "../../../core/context/LoginContext";
import { useLocation } from "react-use";
import { FetchInstances } from "./FetchInstances";
import { Ping } from "./Ping";
import { TestIcbint } from "./TestIcbint";
import { LoginNoICBINT } from "./LoginNoICBINT";
import { RegisterNoICBINT } from "./RegisterNoICBINT";
import { LoginICBINT, FetchUserInfo } from "./FetchUserInfo";


export enum SetupStates {
  FETCH_INSTANCES,
  PINGING,
  TEST_ICBINT,
  LOGIN_ICBINT,
  LOGIN_NO_ICBINT,
  REGISTER_NO_ICBINT,
  FETCH_USER_INFO,
  DONE,
  FAILED,
}

export interface ConnectProp {
  setNextState: (nextState: SetupStates) => void;
}

export const SetupConnection = () => {
  const [state, setState] = useState(SetupStates.FETCH_INSTANCES);
  const loginContext = useContext(LoginContext);
  const location = useLocation();

  const switchState = useMemo(() => {
    switch (state) {
      case SetupStates.FETCH_INSTANCES:
        return <FetchInstances setNextState={setState} />;
      case SetupStates.PINGING:
        return <Ping setNextState={setState} />;
      case SetupStates.TEST_ICBINT:
        return <TestIcbint setNextState={setState} />;
      case SetupStates.LOGIN_ICBINT:
        return <LoginICBINT setNextState={setState} />;
      case SetupStates.LOGIN_NO_ICBINT:
        return <LoginNoICBINT setNextState={setState} />;
      case SetupStates.REGISTER_NO_ICBINT:
        return <RegisterNoICBINT setNextState={setState} />;
      case SetupStates.FETCH_USER_INFO:
        return <FetchUserInfo setNextState={setState} />;
      case SetupStates.FAILED:
        return <Redirect to={`${location.pathname}/user`} />;
      case SetupStates.DONE:
        loginContext.redirectToReferrer();
    }
  }, [state, loginContext, location.pathname]);

  return (
    <Row>
      <Col offset={6} span={12}>
        {switchState}
      </Col>
    </Row>
  );
};
