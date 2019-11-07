import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Input, Tabs, List, BackTop } from "antd";
import { RouteComponentProps } from "react-router";
import { useResource } from "react-request-hook";
import api from "../../core/api/model";
import { NamedPlugin, Song } from "../../core/types";
import { AlbumArt } from "./AlbumArt";

export const Search = (props: RouteComponentProps) => {
  const [providers, getProviders] = useResource(api.getProviders);
  const [query, setQuery] = useState<string>("");

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        props.history.goBack();
      }
    },
    [props.history]
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
      <Col offset={1} span={22}>
        <Row>
          <Input.Search
            placeholder="Search"
            onSearch={value => setQuery(value)}
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
  const [_, enqueue] = useResource(api.enqueue);

  useEffect(() => {
    search(props.provider, props.query);
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

  return (
    <List
      dataSource={searchResult.data}
      renderItem={item => (
        <List.Item key={item.title} onClick={() => enqueueWrapper(item)}>
          <List.Item.Meta
            title={item.title}
            description={item.description.substr(0, 50)}
            avatar={<AlbumArt song={item} />}
          />
        </List.Item>
      )}
    />
  );
};
