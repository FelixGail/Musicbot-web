import React, { useContext, useState, useMemo } from 'react';
import { Redirect } from 'react-router';
import { Row, Col } from 'antd';
import { LoginContext } from '../../../core/context/LoginContext';
import { useLocation } from 'react-use';
import { FetchInstances } from './FetchInstances';
import { Ping } from './Ping';
import { TestIcbint } from './TestIcbint';
import { LoginNoICBINT } from './LoginNoICBINT';
import { RegisterNoICBINT } from './RegisterNoICBINT';
import { FetchUserInfo } from './FetchUserInfo';
import { LoginICBINT } from './LoginICBINT';
import {
  SetupStates,
  ConnectionSetupContext,
} from '../../../core/context/ConnectionSetupContext';

export const SetupConnection = () => {
  const [state, setState] = useState(SetupStates.FETCH_INSTANCES);
  const loginContext = useContext(LoginContext);
  const location = useLocation();
  const context = useMemo(() => {
    return { setNextState: setState };
  }, [setState]);

  const switchState = useMemo(() => {
    switch (state) {
      case SetupStates.FETCH_INSTANCES:
        return <FetchInstances />;
      case SetupStates.PINGING:
        return <Ping />;
      case SetupStates.TEST_ICBINT:
        return <TestIcbint />;
      case SetupStates.LOGIN_ICBINT:
        return <LoginICBINT />;
      case SetupStates.LOGIN_NO_ICBINT:
        return <LoginNoICBINT />;
      case SetupStates.REGISTER_NO_ICBINT:
        return <RegisterNoICBINT />;
      case SetupStates.FETCH_USER_INFO:
        return <FetchUserInfo />;
      case SetupStates.FAILED:
        return <Redirect to={`${location.pathname}/user`} />;
      case SetupStates.DONE:
        return <Redirect to={loginContext.redirect} />;
    }
  }, [state, loginContext, location.pathname]);

  return (
    <Row>
      <Col offset={2} span={20} lg={{ offset: 6, span: 12 }}>
        <ConnectionSetupContext.Provider value={context}>
          {switchState}
        </ConnectionSetupContext.Provider>
      </Col>
    </Row>
  );
};
