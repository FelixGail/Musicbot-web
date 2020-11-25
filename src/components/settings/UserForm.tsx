import { LockOutlined } from "@ant-design/icons";
import { Button, Input, Form } from "antd";
import React, { useCallback } from "react";
import { useUserSetPassword } from "../../core/hooks/user";
import { SpaceBox } from "./Styles";
import { Delete } from "./Delete";

export const UserForm = () => {
  const [{ isLoading, successful, error }, setPassword] = useUserSetPassword();

  const onFinish = useCallback(
    (values: any) => {
      setPassword(values.password);
    },
    [setPassword]
  );
  return (
    <Form onFinish={onFinish}>
      <Form.Item
        name="password"
        hasFeedback={isLoading || successful}
        validateStatus={
          error
            ? "error"
            : isLoading
            ? "validating"
            : successful
            ? "success"
            : undefined
        }
        rules={[
          {
            required: true,
            whitespace: true,
            message: "Please insert a password",
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          visibilityToggle
          autoFocus={false}
        />
      </Form.Item>
      <SpaceBox>
        <Button htmlType="submit" ghost>
          Set Password
        </Button>
        <Delete />
      </SpaceBox>
    </Form>
  );
};
