import React from 'react';
import { useUserLogout } from '../../core/hooks/user';
import { StyledLogoutButton } from './Styles';

export const Logout = () => {
  const logout = useUserLogout();
  return (
    <StyledLogoutButton onClick={logout} ghost>
      Logout
    </StyledLogoutButton>
  );
};
