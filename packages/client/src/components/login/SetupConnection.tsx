import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { Redirect } from "react-router";
import { Row, Col, List } from "antd";
import { ConfigurationContext } from "../../core/context/Configuration";
import { LoginContext } from "../../core/context/LoginContext";
import api from "../../core/api/model";
import { useResource } from "react-request-hook";
import {
  useUserRegister,
  useUserFetch,
  useUserLogin,
} from "../../core/user/user";
import { Canceler } from "axios";
import { useLocation } from "react-use";
import { BotInstance } from "../../core/types";
import moment from "moment";


enum SetupStates {
  SELECT,
  PINGING,
  TEST_ICBINT,
  LOGIN_ICBINT,
  LOGIN_NO_ICBINT,
  REGISTER_NO_ICBINT,
  FETCH_USER_INFO,
  DONE,
  FAILED,
}

interface ConnectProp {
  setNextState: (nextState: SetupStates) => void;
}

export const SetupConnection = () => {
  const [state, setState] = useState(SetupStates.SELECT);
  const loginContext = useContext(LoginContext);
  const location = useLocation();

  const switchState = useMemo(() => {
    switch (state) {
      case SetupStates.SELECT:
        return <Select setNextState={setState} />;
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

const Select = ({setNextState}: ConnectProp) => {
  const {configuration, setConfiguration} = useContext(ConfigurationContext)
  const [{data}, getInstances] = useResource(api.getInstances)
  useEffect(() => {
    const cancel = getInstances(configuration.registryUrl)
    return () => cancel();
  }, [configuration.registryUrl, getInstances])

  const elementCallback = useCallback((instance: BotInstance) => {
    configuration.axios.defaults.baseURL = `http://${instance.address}`;
    setConfiguration({instance: instance});
    setNextState(SetupStates.PINGING)
    console.log(configuration.axios.getUri, configuration.axios.defaults)
  }, [setNextState, setConfiguration, configuration])

  const renderListElement = useCallback((item: BotInstance, index: number) => (
    <List.Item
      onClick={() => elementCallback(item)}
      key={index}
      extra={ moment.duration(Date.now() - item.updated, "ms").format("s")}
    >
      <List.Item.Meta
        title={item.name}
        description={item.address}
      >
      </List.Item.Meta>
    </List.Item>
  ), [elementCallback])

  return (
    <List 
      dataSource={data}
      renderItem={renderListElement}
    />)
}

const Ping = ({ setNextState }: ConnectProp) => {
  const [{ data, error }, getVersion] = useResource(api.getVersion);
  useEffect(() => {
    const cancel = getVersion();
    return () => cancel();
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

  useEffect(() => {
    const cancel = getICBINT();
    return () => cancel();
  }, [getICBINT]);
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
  const [{ successful, error, isLoading }, login] = useUserLogin();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (username) {
      if (password) {
        const cancel = login(username, password);
        return () => cancel && cancel();
      } else {
        setNextState(SetupStates.REGISTER_NO_ICBINT);
      }
    } else {
      setNextState(SetupStates.FAILED);
    }
  }, [setNextState, login]);

  useEffect(() => {
    if (!isLoading) {
      if (successful) {
        setNextState(SetupStates.FETCH_USER_INFO);
      } else if (error) {
        if (error.code && +error.code === 401) {
          setNextState(SetupStates.REGISTER_NO_ICBINT);
        } else {
          setNextState(SetupStates.FAILED);
        }
      }
    }
  }, [successful, isLoading, error, setNextState]);

  return <h1>Logging in with saved credentials</h1>;
};

const RegisterNoICBINT = ({ setNextState }: ConnectProp) => {
  const [{ successful, isLoading, error }, register] = useUserRegister();
  useEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    var cancel: Canceler;
    if (username) {
      cancel = register(username, password || undefined);
    } else {
      setNextState(SetupStates.FAILED);
    }

    return () => cancel && cancel();
  }, [register, setNextState]);

  useEffect(() => {
    if (!isLoading) {
      if (successful) {
        setNextState(SetupStates.FETCH_USER_INFO);
      } else if (error) {
        setNextState(SetupStates.FAILED);
      }
    }
  }, [isLoading, successful, error, setNextState]);

  return <h1>Registering as new User</h1>;
};

const FetchUserInfo = ({ setNextState }: ConnectProp) => {
  const [{ successful, isLoading, error }, fetch] = useUserFetch();
  useEffect(() => {
    const cancel = fetch();

    return () => cancel && cancel();
  }, [fetch]);

  useEffect(() => {
    if (!isLoading) {
      if (successful) {
        setNextState(SetupStates.DONE);
      } else if (error) {
        setNextState(SetupStates.FAILED);
      }
    }
  }, [isLoading, successful, error, setNextState]);

  return <h1>Fetching user info</h1>;
};

const LoginICBINT = (props: ConnectProp) => {
  return <h1>Not Implemented</h1>;
};
