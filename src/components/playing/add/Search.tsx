import React, { useEffect, useState, Fragment } from 'react';
import { Row, Input, Tabs } from 'antd';
import { useResource } from 'react-request-hook';
import Operations, { getHookRequest } from '../../../core/rest/operations';
import { useDebounce } from 'react-use';
import { ProviderPane } from '../snippets/SongPanes';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const StyledTabs = styled(Tabs)`
  width: 100%;
`;

export const Search = (): JSX.Element => {
  const location = useLocation();
  const [providers, getProviders] = useResource(
    getHookRequest(Operations.getProviders),
  );
  const [query, setQuery] = useState<string>(
    location.search.length > 0
      ? decodeURI(location.search.substring(1, location.search.length))
      : '',
  );
  const [undebouncedQuery, setUndebounced] = useState<string>(query);

  useDebounce(
    () => {
      setQuery(undebouncedQuery);
    },
    500,
    [setQuery, undebouncedQuery],
  );

  useEffect(() => {
    getProviders();
  }, [getProviders]);

  return (
    <Fragment>
      <Row>
        <Input.Search
          placeholder="Search"
          defaultValue={query}
          onSearch={(value) => setQuery(value)}
          onChange={(value) => setUndebounced(value.target.value)}
          enterButton="Search"
          size="large"
          allowClear
        />
      </Row>
      <Row>
        {providers.data && (
          <StyledTabs>
            {providers.data.map((provider) => (
              <Tabs.TabPane tab={provider.name} key={provider.id}>
                <ProviderPane query={query} provider={provider} />
              </Tabs.TabPane>
            ))}
          </StyledTabs>
        )}
      </Row>
    </Fragment>
  );
};
