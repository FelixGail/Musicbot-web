import { Route, Redirect, useHistory, useLocation } from "react-router";
import React, { useCallback, useEffect, Fragment } from "react";
import { BackTop, Layout } from "antd";
import { Search } from "./Search";
import Suggest from "./Suggest";
import Stars from "./Stars";
import NavigationCard from "../snippets/FooterCard";
import { StyledContent, StyledLayout } from "../StyledLayout";
import styled from "styled-components";
import { ContentWrapper } from "../snippets/ContentWrapper";

const HighlightingContent = styled(StyledContent)`
  padding-top: 10px;
  color: white;

  .ant-tabs {
    color: #e6e6e6;
  }

  .enqueued {
    opacity: 0.6;
    background-color: #68758d;

    h4,
    .ant-list-item-meta-description {
      color: #cccccc;
    }
  }
`;

const BackTopDiv = styled.div`
  height: 40px;
  width: 40px;
  line-height: 40px;
  border-radius: 4px;
  background-color: #1088e9;
  color: #fff;
  text-align: center;
  font-size: 20px;
`;

const StyledBackTop = styled(BackTop)`
  bottom: 55px;
  left: 5px;
`;

const SearchRouter = () => {
  const location = useLocation();
  const history = useHistory();
  const goHome = useCallback(() => history.push("/"), [history]);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        goHome();
      }
    },
    [goHome]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape, false);
    return () => {
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, [handleEscape]);

  const renderCallback = useCallback(
    () => <Redirect to={`${location.pathname}/search`} />,
    [location.pathname]
  );
  const backTopTarget = useCallback(
    () => document.getElementById("searchContent") || window,
    []
  );

  return (
    <Fragment>
      <StyledBackTop target={backTopTarget}>
        <BackTopDiv>UP</BackTopDiv>
      </StyledBackTop>
      <StyledLayout>
        <HighlightingContent id="searchContent">
          <ContentWrapper>
            <Route exact path="*/add" render={renderCallback} />
            <Route path="*/add/search" component={Search} />
            <Route path="*/add/suggest" component={Suggest} />
            <Route path="*/add/stars" component={Stars} />
          </ContentWrapper>
        </HighlightingContent>
        <Layout.Footer>
          <NavigationCard />
        </Layout.Footer>
      </StyledLayout>
    </Fragment>
  );
};

export default SearchRouter;
