import styled from "styled-components";
import { Layout } from "antd";

const StyledContent = styled(Layout.Content)`
  background-color: #272c35;
  -ms-overflow-style: none;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  position: relative;
`;

export default StyledContent;