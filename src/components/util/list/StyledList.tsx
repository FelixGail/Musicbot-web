import { List } from "antd";
import styled from "styled-components";

export const StyledList = styled(List)`
  flex: 1;

  h4,
  .ant-list-header,
  .ant-empty-description {
    color: #e6e6e6;
  }

  h4 {
    text-shadow: 1px 1px 2px black;
  }
`;

export const StyledListItem = styled(List.Item)`
  &:hover {
    background-color: #1890ff;
    cursor: pointer;

    h4,
    .ant-list-item-meta-description {
      color: #e5e5e5;
    }
  }

  .ant-list-item-meta-description,
  .ant-list-item-action {
    text-shadow: 1px 1px 2px black;
  }

  .ant-list-item-meta-description {
    color: #808080;
  }
`;
