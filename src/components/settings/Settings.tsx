import { LockOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Space, Form, Slider } from 'antd';
import { SliderValue } from 'antd/lib/slider';
import React, { Fragment, useCallback, useContext } from 'react';
import { useResource } from 'react-request-hook';
import styled from 'styled-components';
import api from '../../core/api/model';
import { ConfigurationContext } from '../../core/context/Configuration';
import { useResourceReload } from '../../core/hooks/usePlayerStateContext';
import { hasRefreshToken, Permission } from '../../core/types';
import { useUserDelete, useUserLogout, useUserRefresh, useUserSetPassword } from '../../core/user/user';
import { ContentWrapper } from '../playing/snippets/ContentWrapper';
import { StyledContent, StyledLayout } from "../playing/StyledLayout";
import LinkButton from '../util/LinkButton';
import Permissional from '../util/Permissional';

export const Settings = () => {
    return <StyledLayout>
        <StyledContent>
            <ContentWrapper>
                <StyledSpace direction="vertical">
                    <h1>Settings</h1>
                    <h2>User</h2>
                    Change your password or upgrade your temporary account to a full user by setting one.
                    <UserForm />
                    <Divider />
                    <h2>Permissions</h2>
                    <PermissionList />
                    <Divider />
                    <VolumeSlider />
                    <SpaceBox>
                        <LinkButton ghost to="/">Back</LinkButton>
                        <Logout />
                    </SpaceBox>
                </StyledSpace>
            </ContentWrapper>
        </StyledContent>
    </StyledLayout>
}

const Logout = () => {
    const logout = useUserLogout();
    return <StyledLogoutButton onClick={logout} ghost>Logout</StyledLogoutButton>
}

const StyledLogoutButton = styled(Button)`
    :hover {
        color: #ff4d4f;
        border-color: #ff4d4f;
    }
`;

const Delete = () => {
    const deleteUser = useUserDelete();
    return <Button onClick={deleteUser} type="danger">Delete User</Button>
}

const SpaceBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

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

const UserForm = () => {
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

    return volume.isSupported? <Permissional permission={Permission.CHANGE_VOLUME}>
            <h2>Volume</h2>
            <Slider
                min={0}
                max={100}
                onChange={volumeCallback}
                value={volume.volume}
                tooltipVisible
                style={{marginTop: '50px'}}
            />
            <Divider />
        </Permissional> : <Fragment />
}

const PermissionList = () => {
    const {configuration} = useContext(ConfigurationContext)
    const [, refreshUser] = useUserRefresh();

    const onClick = useCallback(() => {
        if(configuration.token && hasRefreshToken(configuration.token)){
            refreshUser(configuration.token);
        }
    }, [refreshUser, configuration])

    return <Fragment>
        <div style={{marginBottom: "24px"}}>[{(configuration.permissions && configuration.permissions.join(', ')) || `You have not been granted any permissions`}]</div>
        <Button onClick={onClick} ghost>Update</Button>
    </Fragment>
}
