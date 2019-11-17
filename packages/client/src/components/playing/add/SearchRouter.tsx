import { RouteComponentProps, Route, Redirect } from "react-router";
import React, { useCallback, useEffect } from "react";
import { BackTop, Col, Icon, Card, Layout } from "antd";
import { Search } from "./Search";
import Suggest from "./Suggest";
import Stars from "./Stars";
import { Link } from "react-router-dom";

const SearchRouter = (props: RouteComponentProps) => {
  const goHome = useCallback(() => props.history.push("/"), [props.history]);

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

  return (
    <div className="search-router">
      <BackTop />
      <Layout>
        <Layout.Content>
          <Col span={3}>
            <Icon className="back-arrow" type="double-left" onClick={goHome} />
          </Col>
          <Col span={19}>
            <Route
              exact
              path="*/add"
              render={() => (
                <Redirect to={`${props.location.pathname}/search`} />
              )}
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
