import React, {
  useContext,
  useEffect,
  useCallback,
  useState,
  Fragment,
} from "react";
import { List, Empty, Input } from "antd";
import { ConfigurationContext } from "../../../core/context/Configuration";
import Operations from "../../../core/rest/operations";
import { BotInstance } from "../../../core/types";
import { duration } from "moment";
import { ClockCircleOutlined } from "@ant-design/icons";
import formatDuration from "../../util/FormatDuration";
import { StyledList, StyledListItem } from "../../util/list/StyledList";
import styled, { StyledComponent } from "styled-components";
import { ReactSVG } from "react-svg";
import logo from "../../../resources/img/kiu_striked.svg";
import {
  ConnectionSetupContext,
  SetupStates,
} from "../../../core/context/ConnectionSetupContext";
import { isInstanceAvailable, fromString } from "../../../core/instance";
import { ListProps } from "antd/lib/list";
import { useResourceReload } from "../../../core/hooks/resourceReloadHook";

const StyledInstanceListItem = styled(StyledListItem)`
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border-bottom: 0px !important;
  background-color: #1890ff;

  h4 {
    margin-bottom: 0px;
  }

  &:hover {
    background-color: #005bb1;
  }
`;

const StyledInstanceList = styled(StyledList)`
  padding-top: 30px;
` as StyledComponent<typeof List, ListProps<BotInstance>, any, never>;

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

    .primary,
    .secondary {
      fill: #3d4452;
    }
  }
`;

export const FetchInstances = () => {
  const { setNextState } = useContext(ConnectionSetupContext);
  const { configuration, setConfiguration } = useContext(ConfigurationContext);
  const [availableInstances, setAvailableInstances] = useState<BotInstance[]>(
    []
  );

  useEffect(() => {
    if (configuration.axios.defaults.baseURL?.length !== 0) {
      configuration.axios.defaults.baseURL = "";
    }
  }, [configuration.axios.defaults.baseURL]);

  const instances = useResourceReload(
    Operations.getInstances,
    [],
    10000,
    true,
    configuration.registryUrl
  );

  const elementCallback = useCallback(
    (instance: BotInstance) => {
      configuration.axios.defaults.baseURL = `https://${instance.domain}:${instance.port}/`;
      setConfiguration({ instance: instance });
      setNextState(SetupStates.PINGING);
    },
    [setNextState, setConfiguration, configuration.axios.defaults.baseURL]
  );

  useEffect(() => {
    if (instances.length > 0) {
      Promise.all(instances.map((i) => isInstanceAvailable(i))).then((arr) => {
        setAvailableInstances(
          arr.reduce<BotInstance[]>(
            (c, b, i) => (b ? c.concat(instances[i]) : c),
            []
          )
        );
      });
    }
  }, [instances, elementCallback]);

  const renderListElement = useCallback(
    (item: BotInstance, index: number) => (
      <StyledInstanceListItem
        onClick={() => elementCallback(item)}
        key={index}
        extra={
          <div>
            <ClockCircleOutlined />{" "}
            {formatDuration(duration(Date.now() - item.updated))} ago
          </div>
        }
      >
        <List.Item.Meta title={item.name} />
      </StyledInstanceListItem>
    ),
    [elementCallback]
  );

  return (
    <Fragment>
      <StyledInstanceList
        dataSource={availableInstances}
        renderItem={renderListElement}
        locale={{
          emptyText: (
            <InstanceEmpty
              description="Could not find any MusicBot instances on your network."
              image={<StyledSVG src={logo} />}
            />
          ),
        }}
      />
      <Input.Search
        placeholder="Input manually"
        enterButton="Connect"
        onSearch={(value) => {
          const instance = fromString(value);
          if (instance) {
            elementCallback(instance);
          }
        }}
      />
    </Fragment>
  );
};
