import { Button, Divider, Space } from 'antd';
import styled from 'styled-components';

export const StyledLogoutButton = styled(Button)`
  :hover {
    color: #ff4d4f;
    border-color: #ff4d4f;
  }
`;

export const DangerButton = styled(Button)`
  color: #fff;
  background-color: #ff4d4f;
  border-color: #ff4d4f;

  :hover {
    background-color: #ff7875;
    border-color: #ff7875;
    color: #fff;
  }
`;

export const SpaceBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
export const StyledSpace = styled(Space)`
  width: 100%;
  color: #e6e6e6;

  h1,
  h2 {
    color: #e6e6e6;
  }

  h1 {
    font-size: 36px;
  }

  .ant-space-item {
    width: 100%;
  }
`;

export const StyledDivider = styled(Divider)`
  background-color: #e6e6e6;
`;
