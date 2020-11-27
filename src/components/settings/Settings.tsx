import React from 'react';
import { ContentWrapper } from '../playing/snippets/ContentWrapper';
import { StyledContent, StyledLayout } from '../playing/StyledLayout';
import LinkButton from '../util/LinkButton';
import { Logout } from './Logout';
import { PermissionList } from './PermissionList';
import { StyledSpace, StyledDivider, SpaceBox } from './Styles';
import { UserForm } from './UserForm';
import { VolumeSlider } from './VolumeSlider';

export const Settings = (): JSX.Element => {
  return (
    <StyledLayout>
      <StyledContent>
        <ContentWrapper>
          <StyledSpace direction="vertical">
            <h1>Settings</h1>
            <h2>User</h2>
            Change your password or upgrade your temporary account to a full
            user by setting one.
            <UserForm />
            <StyledDivider />
            <h2>Permissions</h2>
            <PermissionList />
            <StyledDivider />
            <VolumeSlider />
            <SpaceBox>
              <LinkButton ghost to="/">
                Back
              </LinkButton>
              <Logout />
            </SpaceBox>
          </StyledSpace>
        </ContentWrapper>
      </StyledContent>
    </StyledLayout>
  );
};
