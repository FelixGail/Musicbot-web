import { Route, Redirect, useHistory, useLocation } from "react-router";
import React, { useCallback, useEffect } from "react";
import { BackTop, Col, Icon, Card, Layout } from "antd";
import { Search } from "./Search";
import Suggest from "./Suggest";
import Stars from "./Stars";
import { Link } from "react-router-dom";

const SearchRouter = () => {
  const location = useLocation()
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

  const renderCallback = useCallback(() => <Redirect to={`${location.pathname}/search`} />, [location.pathname])
  const backTopTarget = useCallback(() => document.getElementById("searchContent") || window, [])

  return (
    <div className="search-router">
      <BackTop target={backTopTarget}>
        <div className="ant-back-top-inner">UP</div>
      </BackTop>
      <Layout>
        <Layout.Content id="searchContent">
          <Col span={3}>
            <Icon className="back-arrow" type="double-left" onClick={goHome} />
          </Col>
          <Col span={19}>
            <Route
              exact
              path="*/add"
              render={renderCallback}
            />
            <Route path="*/add/search" component={Search} />
            <Route path="*/add/suggest" component={Suggest} />
            <Route path="*/add/stars" component={Stars} />
          </Col>
        </Layout.Content>
        <Layout.Footer>
          <Card
            className="search-router-navigation spanning"
            actions={[
              <Link to="/listen">
                <Icon type="unordered-list" />
              </Link>,
              <Link to="/add/search">
                <Icon type="search" />
              </Link>,
              <Link to="/add/suggest">
                <Icon type="question" />
              </Link>,
              <Link to="/add/stars">
                <Icon type="star" />
              </Link>
            ]}
          ></Card>
        </Layout.Footer>
      </Layout>
    </div>
  );
};

export default SearchRouter;
