import React, { useState, useContext, useEffect, useCallback } from "react";
import { ConfigurationContext } from "../../core/context/Configuration";
import { LoginContext } from "../../core/context/LoginContext";
import { Button, Form, Input, Icon, Col, Row, Checkbox } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { useUserLogin, useUserRegister } from "../../core/user/user";

const MAX_USERNAME_LENGTH = 20;

const FormProps = {
  xs: {
    offset: 2,
    span: 20
  },
  sm: {
    offset: 6,
    span: 12
  },
  xl: {
    offset: 9,
    span: 6
  }
};

type FormData = {
  username: string;
  password: string | null;
};

export const LForm = (props: FormComponentProps) => {
  const [expectPassword, setExpectPassword] = useState<boolean>(false);
  const [loginResult, login] = useUserLogin();
  const [registerResult, register] = useUserRegister();
  const [successful, isLoading, error] = [
    loginResult.successful || registerResult.successful,
    loginResult.isLoading || registerResult.isLoading,
    loginResult.error || registerResult.error
  ];
  const { setError, redirectToReferrer } = useContext(LoginContext);
  const { configuration } = useContext(ConfigurationContext);
  const { getFieldDecorator, validateFields, setFieldsValue } = props.form;

  const onSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      validateFields((err, values: FormData) => {
        if (!err && values) {
          if (values.password) {
            login(values.username, values.password);
          } else {
            register(values.username);
          }
        }
      });
    },
    [login, register, validateFields]
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
          throw error;
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
      setFieldsValue({ password: undefined });
      setExpectPassword(false);
    }
  }, [expectPassword, setExpectPassword, setFieldsValue]);

  return (
    <Row>
      <Col {...FormProps}>
        <Form onSubmit={onSubmit}>
          <Form.Item>
            {getFieldDecorator("username", {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please select a username."
                },
                {
                  max: MAX_USERNAME_LENGTH,
                  message: `max. username length is ${MAX_USERNAME_LENGTH}.`
                }
              ]
            })(
              <Input
                autoFocus
                prefix={<Icon type="user" />}
                type="text"
                placeholder="Username"
                onChange={hidePasswordField}
              />
            )}
          </Form.Item>
          {expectPassword && (
            <Form.Item>
              {getFieldDecorator("password")(
                <Input
                  prefix={<Icon type="lock" />}
                  type="password"
                  placeholder="Password"
                  autoFocus
                />
              )}
            </Form.Item>
          )}
          {!configuration.icbintKey && (
            <Form.Item extra="This server does not support ICBINT. It is therefore not possible to encrypt communications or verify the authenticity of the server.">
              {getFieldDecorator("icbint", {
                valuePropName: "checked",
                rules: [
                  {
                    required: true,
                    validator: checkCheckbox
                  }
                ]
              })(
                <Checkbox>
                  I accept the risks arising from the missing{" "}
                  <a href="https://bjoernpetersen.github.io/ICBINT/">ICBINT</a>{" "}
                  protocol.
                </Checkbox>
              )}
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export const LoginForm = Form.create()(LForm);
