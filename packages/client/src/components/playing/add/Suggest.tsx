import { useResource } from "react-request-hook";
import api from "../../../core/api/model";
import { useEffect } from "react";
import React from "react";
import { Row, Tabs } from "antd";
import { SuggesterPane } from "../snippets/SongPanes";
import styled from "styled-components";

const Suggest = () => {
  const [suggesters, getSuggesters] = useResource(api.getSuggesters);

  useEffect(() => {
    getSuggesters();
  }, [getSuggesters]);

  const StyledTabs = styled(Tabs)`
    width: 100%;
  `;

  if(!suggesters.data) {
    return null
  }

  return (<StyledTabs>
            {suggesters.data.map((suggester, _) => (
              <Tabs.TabPane tab={suggester.name} key={suggester.id}>
                <SuggesterPane suggester={suggester} />
              </Tabs.TabPane>
            ))}
          </StyledTabs>
        
  );
};

export default Suggest;
