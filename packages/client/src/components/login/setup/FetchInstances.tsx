import React, { useContext, useEffect, useCallback } from "react";
import { List, Empty } from "antd";
import { ConfigurationContext } from "../../../core/context/Configuration";
import api from "../../../core/api/model";
import { BotInstance } from "../../../core/types";
import { duration } from "moment";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useResourceReload } from "../../../core/hooks/usePlayerStateContext";
import formatDuration from "../../util/FormatDuration";
import { ConnectProp, SetupStates } from "./SetupConnection";
import { StyledList, StyledListItem } from "../../util/StyledList";
import styled from "styled-components";
import { ReactSVG } from "react-svg";
import logo from "../../../img/kiu_striked.svg"

const StyledInstanceListItem = styled(StyledListItem)`
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border-bottom: 0px !important;
  background-color: #1890ff;

  &:hover{
    background-color: #005bb1;
  }
`;

const StyledInstanceList = styled(StyledList)`
  padding-top: 30px;
`;

const InstanceEmpty = styled(Empty)`
  .ant-empty-image {
    height: auto;
  }

  .ant-empty-description {
    color: #1890ff;
  }
`;

const StyledSVG = styled(ReactSVG)`
  div {
    svg {
      max-height: 30%;
      max-width: 40%;
    }

    .primary, .secondary {
      fill: #3d4452;
    }
  }
`;

export const FetchInstances = ({ setNextState }: ConnectProp) => {
  const { configuration, setConfiguration } = useContext(ConfigurationContext);
  const instances = useResourceReload(
      api.getInstances,
      [],
      20000,
      true,
      configuration.registryUrl);

  const elementCallback = useCallback((instance: BotInstance) => {
    configuration.axios.defaults.baseURL = `http://${instance.address}`;
    setConfiguration({ instance: instance });
    setNextState(SetupStates.PINGING);
  }, [setNextState, setConfiguration, configuration]);

  useEffect(() => {
    if (instances.length === 1) {
      elementCallback(instances[0]);
    }
  }, [elementCallback, instances]);

  const renderListElement = useCallback(
      (item: BotInstance, index: number) => 
        (<StyledInstanceListItem
          onClick={() => elementCallback(item)}
          key={index}
          extra={<div>
            <ClockCircleOutlined /> {formatDuration(duration(Date.now() - item.updated))} ago
          </div>}
        >
          <List.Item.Meta title={item.name} description={item.address}/>
        </StyledInstanceListItem>)
      , [elementCallback]);

  return (
    <StyledInstanceList
      dataSource={instances}
      renderItem={renderListElement}
      locale={{
        emptyText: <InstanceEmpty
          description='Could not find any MusicBot instances on your network.'
          image={<StyledSVG src={logo}/>}
        />,
      }}
    />);
};
