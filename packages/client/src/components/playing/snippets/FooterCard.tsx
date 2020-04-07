import { Card } from "antd";
import { Link } from "react-router-dom";
import {
  UnorderedListOutlined,
  SearchOutlined,
  QuestionOutlined,
  StarOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import React from "react";

const StyledCard = styled(Card)`
  .ant-card-body {
    padding: 0px;
  }
`;

const NavigationCard = () => (
  <StyledCard
    actions={[
      <Link to="/listen">
        <UnorderedListOutlined />
      </Link>,
      <Link to="/add/search">
        <SearchOutlined />
      </Link>,
      <Link to="/add/suggest">
        <QuestionOutlined />
      </Link>,
      <Link to="/add/stars">
        <StarOutlined />
      </Link>,
    ]}
  ></StyledCard>
);

export default NavigationCard;
