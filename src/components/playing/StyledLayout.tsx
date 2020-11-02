import styled from "styled-components";
import { Layout } from "antd";

export const StyledContent = styled(Layout.Content)`
  -ms-overflow-style: none;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;

  &::-webkit-scrollbar {
    width: 0px;
    display: none;
  }
`;

export const StyledLayout = styled(Layout)`
  background-color: #272c35;
  display: flex;
  min-height: -webkit-fill-available;
  min-height: ${props => props.height}px;

  max-height: -webkit-fill-available;
  max-height: ${props => props.height}px;

  .ant-layout-footer {
    padding: 0;
  }
`;
