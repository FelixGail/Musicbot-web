import styled from "styled-components";
import { Layout } from "antd";

export const StyledContent = styled(Layout.Content)`
  background-color: #272c35;
  -ms-overflow-style: none;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    width: 0px;
    display: none;
  }
`;

export const StyledLayout = styled(Layout)`
  display: flex;
  min-height: 100vh !important;
  min-height: -webkit-fill-available !important;

  max-height: 100vh !important;
  max-height: -webkit-fill-available !important;

  .ant-layout-footer {
    padding: 0;
  }
`;