import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Input, Tabs, BackTop, Icon } from "antd";
import { RouteComponentProps } from "react-router";
import { useResource } from "react-request-hook";
import api from "../../core/api/model";
import { NamedPlugin, Song } from "../../core/types";
import { useDebounce } from "react-use";
import { SongList } from "./SongList";

export const Search = (props: RouteComponentProps) => {
  const [providers, getProviders] = useResource(api.getProviders);
  const [query, setQuery] = useState<string>(
    props.location.search.length > 0
      ? decodeURI(
          props.location.search.substring(1, props.location.search.length)
        )
      : ""
  );
  const [undebouncedQuery, setUndebounced] = useState<string>(query);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        props.history.goBack();
      }
    },
    [props.history]
  );

  useDebounce(
    () => {
      setQuery(undebouncedQuery);
    },
    500,
    [setQuery, undebouncedQuery]
  );

  useEffect(() => {
    getProviders();
    document.addEventListener("keydown", handleEscape, false);
    return () => {
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, [getProviders, handleEscape]);

  return (
    <div className="search">
      <BackTop />
      <Col span={3}>
        <Icon
          className="close-search"
          type="double-left"
          onClick={props.history.goBack}
        />
      </Col>
      <Col span={19}>
        <Row>
          <Input.Search
            placeholder="Search"
            defaultValue={query}
            onSearch={value => setQuery(value)}
            onChange={value => setUndebounced(value.target.value)}
            enterButton="Search"
            size="large"
          />
        </Row>
        <Row>
          {providers.data && (
            <Tabs>
              {providers.data.map((provider, _) => (
                <Tabs.TabPane tab={provider.name} key={provider.id}>
                  <ProviderPane query={query} provider={provider} />
                </Tabs.TabPane>
              ))}
            </Tabs>
          )}
        </Row>
      </Col>
    </div>
  );
};

const ProviderPane = (props: { query: string; provider: NamedPlugin }) => {
  const [searchResult, search] = useResource(api.search);
  const [, enqueue] = useResource(api.enqueue);

  useEffect(() => {
    if (props.query.length > 0) {
      search(props.provider, props.query);
    }
  }, [props.query, props.provider, search]);

  const enqueueWrapper = useCallback(
    (song: Song) => {
      enqueue(song, props.provider);
      if (searchResult.data) {
        searchResult.data = searchResult.data.filter(item => item !== song);
      }
    },
    [props.provider, enqueue, searchResult.data]
  );

  return <SongList songs={searchResult.data} onClick={enqueueWrapper} />;
};
