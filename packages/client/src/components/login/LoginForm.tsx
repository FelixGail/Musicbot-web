import React, { useState, useContext, useEffect, useCallback } from "react";
import { ConfigurationContext } from "../../core/context/Configuration";
import { LoginContext } from "../../core/context/LoginContext";
import { Button, Form, Input, Col, Row, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useUserLogin, useUserRegister } from "../../core/user/user";
import styled from "styled-components";

const MAX_USERNAME_LENGTH = 20;

const FormProps = {
  xs: {
    offset: 2,
    span: 20,
  },
  sm: {
    offset: 6,
    span: 12,
  },
  xl: {
    offset: 9,
    span: 6,
  },
};

type FormData = {
  username: string;
  password: string | null;
};

export const LoginForm = () => {
  const [expectPassword, setExpectPassword] = useState<boolean>(false);
  const [loginResult, login] = useUserLogin();
  const [registerResult, register] = useUserRegister();
  const [successful, isLoading, error] = [
    loginResult.successful || registerResult.successful,
    loginResult.isLoading || registerResult.isLoading,
    loginResult.error || registerResult.error,
  ];
  const { setError, redirectToReferrer } = useContext(LoginContext);
  const { configuration } = useContext(ConfigurationContext);
  const [form] = Form.useForm();

  const onFinish = useCallback(
    (values: any) => {
      if (expectPassword) {
        login(values["username"], values["password"]);
      } else {
        register(values["username"]);
      }
    },
    [login, register, expectPassword]
  );

  useEffect(() => {
    if (!isLoading) {
      if (successful) {
        redirectToReferrer();
      } else if (error) {
        if (error.code) {
          const codeNumber = +error.code;
          switch (codeNumber) {
            case 409:
              setExpectPassword(true);
              break;
            case 403:
            case 404:
              setError("Incorrect username password combination.");
              break;
            default:
              setError(`Error ${error.code}: ${error.message}`);
          }
        } else {
          setError(`Unexpected error: ${error.message}`);
        }
      }
    }
  }, [successful, error, isLoading, setError, redirectToReferrer]);

  const checkCheckbox = useCallback((rule, value, callback) => {
    if (!value) {
      callback("Please accept the ICBINT warning.");
    } else {
      callback();
    }
  }, []);

  const hidePasswordField = useCallback(() => {
    if (expectPassword) {
      form.setFieldsValue({ password: undefined });
      setExpectPassword(false);
    }
  }, [expectPassword, setExpectPassword, form]);

  return (
    <Row>
      <Col {...FormProps}>
        <StyledForm onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please select a username.",
              },
              {
                max: MAX_USERNAME_LENGTH,
                message: `max. username length is ${MAX_USERNAME_LENGTH}.`,
              },
            ]}
          >
            <Input
              autoFocus
              prefix={<UserOutlined />}
              type="text"
              placeholder="Username"
              onChange={hidePasswordField}
            />
          </Form.Item>
          {expectPassword && (
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please insert your password",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
                autoFocus
              />
            </Form.Item>
          )}
          {!configuration.icbintKey && (
            <Form.Item
              extra="This server does not support ICBINT. It is therefore not possible to encrypt communications or verify the authenticity of the server."
              valuePropName="checked"
              rules={[
                {
                  required: true,
                  validator: checkCheckbox,
                },
              ]}
            >
              <Checkbox>
                I accept the risks arising from the missing{" "}
                <a href="https://bjoernpetersen.github.io/ICBINT/">ICBINT</a>{" "}
                protocol.
              </Checkbox>
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </StyledForm>
      </Col>
    </Row>
  );
};

const StyledForm = styled(Form)`
  background-color: white;
  padding: 25px;
  border-radius: 25px;
  box-shadow: 2px 2px 2px 3px #181b20;
  margin-top: 25px;
`;
