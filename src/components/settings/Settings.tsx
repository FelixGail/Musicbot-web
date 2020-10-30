import { Button, Divider } from 'antd';
import React from 'react';
import { useUserLogout } from '../../core/user/user';
import { ContentWrapper } from '../playing/snippets/ContentWrapper';
import { StyledContent, StyledLayout } from "../playing/StyledLayout";
import LinkButton from '../util/LinkButton';

export const Settings = () => {
    return <StyledLayout>
        <StyledContent>
            <ContentWrapper>
                <Logout/>
                <Divider />
                <LinkButton ghost to="/">Back</LinkButton>
            </ContentWrapper>
        </StyledContent>
    </StyledLayout>
}

const Logout = () => {
    const logout = useUserLogout()
    return <Button onClick={logout} ghost>Logout</Button>
}
