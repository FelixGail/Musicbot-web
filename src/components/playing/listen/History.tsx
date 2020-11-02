import React, { useCallback, useMemo, useContext, Fragment } from "react";
import api, { getHookRequest } from "../../../core/api/model";
import { SongList } from "../songlist/SongList";
import ScreenNavigation from "../../util/ScreenNavigation";
import { Permission, SongEntry } from "../../../core/types";
import { useResource } from "react-request-hook";
import useHasPermission from "../../../core/hooks/useHasPermission";
import { FullscreenContext } from "../../../core/context/FullscreenContext";
import PlayerStateContext from "../../../core/context/PlayerStateContext";
import { useHistory } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import styled from "styled-components";
import { ContentWrapper } from "../snippets/ContentWrapper";
import SwipeDiv from "../../util/SwipeDiv";

const History = () => {
  const { history } = useContext(PlayerStateContext);
  const [, enqueue] = useResource(getHookRequest(api.enqueue));
  const hasEnqueuePermission = useHasPermission(Permission.ENQUEUE);
  const {toggle} = useContext(FullscreenContext);
  const browserHistory = useHistory();
  const left = `queue`;
  const right = `/listen`;
  const swipeHandler = useSwipeable({
    onSwipedLeft: () => browserHistory.push(right),
    onSwipedRight: () => browserHistory.push(left),
    preventDefaultTouchmoveEvent: true,
  });

  const enqueueWrapper = useCallback(
    (value: SongEntry) => {
      if (hasEnqueuePermission) {
        enqueue(value.song);
        return true;
      }
      return false;
    },
    [enqueue, hasEnqueuePermission]
  );

  const jsx = useMemo(
    () => (
      <Fragment>
          <SwipeDiv {...swipeHandler}>
          <ScreenNavigation left={left} right={right} center={toggle} />
          <ContentWrapper>
            <StyledSongList
              header="History"
              items={history}
              onClick={enqueueWrapper}
            />
          </ContentWrapper>
        </SwipeDiv>
      </Fragment>
      
    ),
    [history, enqueueWrapper, toggle, left, right, swipeHandler]
  );

  return jsx;
};

const StyledSongList = styled(SongList)`
  .enqueued {
    opacity: 0.6;
    background-color: #68758d;

    h4,
    .ant-list-item-meta-description {
      color: #cccccc;
    }
  }
`;

export default History;
