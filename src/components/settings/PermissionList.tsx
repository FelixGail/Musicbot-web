import { Button, Drawer } from 'antd';
import React, { Fragment, useCallback, useContext, useState } from 'react';
import { ConfigurationContext } from '../../core/context/Configuration';
import { hasRefreshToken, Permission } from '../../core/types';
import { useUserRefresh } from '../../core/hooks/user';
import Permissional from '../util/Permissional';
import { SpaceBox, DangerButton } from './Styles';

export const PermissionList = () => {
    const { configuration } = useContext(ConfigurationContext);
    const [, refreshUser] = useUserRefresh();
    const [drawerVisibility, setDrawerVisibility] = useState(false);

    const setVisible = useCallback(() => setDrawerVisibility(true), [setDrawerVisibility]);
    const setInvisible = useCallback(() => setDrawerVisibility(false), [setDrawerVisibility]);

    const onClick = useCallback(() => {
        if (configuration.token && hasRefreshToken(configuration.token)) {
            refreshUser(configuration.token);
        }
    }, [refreshUser, configuration]);

    return <Fragment>
        <div style={{ marginBottom: "24px" }}>[{(configuration.permissions && configuration.permissions.join(', ')) || `You have not been granted any permissions`}]</div>
        <SpaceBox>
            <Button onClick={onClick} ghost>Update</Button>
            <Permissional permission={Permission.ADMIN}>
                <DangerButton onClick={setVisible}>Manage Users</DangerButton>
                <PermissionDrawer visible={drawerVisibility} setInvisible={setInvisible}/>
            </Permissional>
        </SpaceBox>
    </Fragment>;
};

const PermissionDrawer = (props: {visible: boolean, setInvisible: () => void}) => {
    return <Drawer
        onClose={props.setInvisible}
        closable={true}
        visible={props.visible}
        placement="bottom"
    >

    </Drawer>
}
