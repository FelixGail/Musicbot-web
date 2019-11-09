import React, { useEffect, useState } from "react";
import { Row, Input, Tabs } from "antd";
import { RouteComponentProps } from "react-router";
import { useResource } from "react-request-hook";
import api from "../../core/api/model";
import { useDebounce } from "react-use";
import { ProviderPane } from "./SongPanes";

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

  useDebounce(
    () => {
      setQuery(undebouncedQuery);
    },
    500,
    [setQuery, undebouncedQuery]
  );

  useEffect(() => {
    getProviders();
  }, [getProviders]);

  return (
    <div className="search">
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
    </div>
  );
};
