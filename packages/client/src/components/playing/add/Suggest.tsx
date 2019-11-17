import { useResource } from "react-request-hook";
import api from "../../../core/api/model";
import { useEffect } from "react";
import React from "react";
import { Row, Tabs } from "antd";
import { SuggesterPane } from "../snippets/SongPanes";

const Suggest = () => {
  const [suggesters, getSuggesters] = useResource(api.getSuggesters);

  useEffect(() => {
    getSuggesters();
  }, [getSuggesters]);

  return (
    <div className="suggest">
      <Row>
        {suggesters.data && (
          <Tabs>
            {suggesters.data.map((suggester, _) => (
              <Tabs.TabPane tab={suggester.name} key={suggester.id}>
                <SuggesterPane suggester={suggester} />
              </Tabs.TabPane>
            ))}
          </Tabs>
        )}
      </Row>
    </div>
  );
};

export default Suggest;
