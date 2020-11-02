import { LockOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Space, Form, Slider } from 'antd';
import { SliderValue } from 'antd/lib/slider';
import React, { Fragment, useCallback } from 'react';
import { useResource } from 'react-request-hook';
import styled from 'styled-components';
import api from '../../core/api/model';
import { useResourceReload } from '../../core/hooks/usePlayerStateContext';
import { useUserDelete, useUserLogout, useUserSetPassword } from '../../core/user/user';
import { ContentWrapper } from '../playing/snippets/ContentWrapper';
import { StyledContent, StyledLayout } from "../playing/StyledLayout";
import LinkButton from '../util/LinkButton';

export const Settings = () => {
    return <StyledLayout>
        <StyledContent>
            <ContentWrapper>
                <StyledSpace direction="vertical">
                    <h1>Settings</h1>
                    <h2>User</h2>
                    <PasswordForm />
                    <Logout />
                    <Delete />
                    <Divider />
                    <VolumeSlider />
                    <LinkButton ghost to="/">Back</LinkButton>
                </StyledSpace>
            </ContentWrapper>
        </StyledContent>
    </StyledLayout>
}

const Logout = () => {
    const logout = useUserLogout();
    return <Button onClick={logout} ghost>Logout</Button>
}

const Delete = () => {
    const deleteUser = useUserDelete();
    return <Button onClick={deleteUser} type="danger">Delete User</Button>
}

const StyledSpace = styled(Space)`
    width: 100%;
    color: #e6e6e6;

    h1, h2 {
        color: #e6e6e6;
    }

    h1 {
        font-size: 36px;
    }

    .ant-space-item {
        width: 100%;
    }
`;

const PasswordForm = () => {
    const [{isLoading, successful, error}, setPassword] = useUserSetPassword();

    const onFinish = useCallback((values: any) => {
        setPassword(values.password);
    }, [setPassword])
    return (
        <Form onFinish={onFinish}>
            <Form.Item
              name="password"
              hasFeedback
              validateStatus={error? "error" : (isLoading? "validating" : (successful? "success" : ""))}
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
                autoFocus
              />
            </Form.Item>
            <Button htmlType="submit" ghost>
              Set Password
            </Button>
        </Form>
    )
}

const VolumeSlider = () => {
    const volume = useResourceReload(api.getVolume, {volume: 0, isSupported: false}, 1000, false);
    const [, setVolume] = useResource(api.setVolume);

    const volumeCallback = useCallback((value: SliderValue) => {
        if(typeof value === 'number') {
            setVolume(value);
        }
    }, [setVolume]);

    return volume.isSupported? <Fragment>
            <h2>Volume</h2>
            <Slider
                min={1}
                max={100}
                onChange={volumeCallback}
                value={volume.volume}
                tooltipVisible
                style={{marginTop: '50px'}}
            />
            <Divider />
        </Fragment> : <Fragment />
}
