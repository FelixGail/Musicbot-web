import React, {
  useCallback,
  useContext,
  useMemo,
  FunctionComponent,
  Fragment,
  useEffect,
  useState,
} from "react";
import { useResource } from "react-request-hook";
import ScreenNavigation from "../../util/ScreenNavigation";
import { SongEntry, Permission } from "../../../core/types";
import { ConfigurationContext } from "../../../core/context/Configuration";
import Conditional from "../../util/Conditional";
import { DeleteOutlined } from "@ant-design/icons";
import { useHistory, useLocation } from "react-router";
import { ContextModalElement } from "../../util/ContextModal";
import { useSearchSongModalElements } from "../../util/DefaultContextModal";
import Permissional from "../../util/Permissional";
import { FullscreenContext } from "../../../core/context/FullscreenContext";
import PlayerStateContext from "../../../core/context/PlayerStateContext";
import { useSwipeable } from "react-swipeable";
import { ContentWrapper } from "../snippets/ContentWrapper";
import SwipeDiv from "../../util/SwipeDiv";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import Operations, { getHookRequest } from "../../../core/rest/operations";
import useHasPermission from "../../../core/hooks/hasPermissionHook";
import { SongList } from "../../util/list/songlist/SongList";

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const Queue: FunctionComponent = () => {
  const { queue } = useContext(PlayerStateContext);
  const [savedQueue, saveQueue] = useState(queue);
  const hasMovePermission = useHasPermission(Permission.MOVE)
  const [{ error: moveError }, move] = useResource(
    getHookRequest(Operations.moveEntry)
  );

  useEffect(() => {
    saveQueue(queue);
  }, [queue, saveQueue, moveError]);

  const history = useHistory();
  const location = useLocation();
  const { toggle } = useContext(FullscreenContext);

  const left = `/listen`;
  const right = `history`;
  const swipeHandler = useSwipeable({
    onSwipedLeft: () => history.push(right),
    onSwipedRight: () => history.push(left),
    preventDefaultTouchmoveEvent: true,
  });

  const [, dequeue] = useResource(getHookRequest(Operations.dequeue));
  const click = useCallback(
    (_, index: number) => {
      history.push(`${location.pathname}/${index}`);
      return false;
    },
    [history, location.pathname]
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;
      if (
        result.reason === "DROP" &&
        destination &&
        source.index !== destination.index
      ) {
        const entry = savedQueue[source.index];
        move(destination.index, entry.song);
        saveQueue(reorder(savedQueue, source.index, destination.index));
      }
    },
    [move, savedQueue, saveQueue]
  );

  const hasRemovePermission = useHasPermission(Permission.SKIP);
  const { configuration } = useContext(ConfigurationContext);

  const additional = useCallback(
    (item: SongEntry) => (
      <Conditional
        condition={
          hasRemovePermission || item.userName === configuration.username
        }
        alt={<div style={{ paddingLeft: "7px", paddingRight: "7px" }}></div>}
      >
        <DeleteOutlined
          onClick={(event) => {
            dequeue(item.song);
            event.stopPropagation();
          }}
        />
      </Conditional>
    ),
    [configuration.username, dequeue, hasRemovePermission]
  );
  const additionalArray = useMemo(() => [additional], [additional]);

  const searchElements = useSearchSongModalElements<SongEntry>();

  const contextElements: ContextModalElement<SongEntry>[] = useMemo(() => {
    return [
      {
        element: () => (
          <Permissional permission={Permission.MOVE}>Move to top</Permissional>
        ),
        onClick: (item) => move(0, item.song),
        close: true,
      },
      {
        element: (item) => (
          <Conditional
            condition={
              hasRemovePermission || item.userName === configuration.username
            }
          >
            Remove
          </Conditional>
        ),
        onClick: (item) => dequeue(item.song),
        close: true,
      },
    ];
  }, [move, hasRemovePermission, configuration.username, dequeue]);
  const combinedElements = useMemo(
    () => contextElements.concat(searchElements),
    [searchElements, contextElements]
  );

  const wrapper = useCallback(
    (
      item: SongEntry,
      index: number,
      inner: (entry: SongEntry, index: number) => JSX.Element
    ) => {
      return (
        <Draggable 
          draggableId={item.song.id}
          index={index}
          key={item.song.id}
          isDragDisabled={!hasMovePermission}  
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              {inner(item, index)}
            </div>
          )}
        </Draggable>
      );
    },
    [hasMovePermission]
  );

  const jsx = useMemo(
    () => (
      <Fragment>
        <SwipeDiv {...swipeHandler}>
          <ScreenNavigation left={left} right={right} center={toggle} />
          <ContentWrapper>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="queue">
                {(provided, snapshot) => {
                  return (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <SongList
                        header="Queue"
                        items={savedQueue}
                        onClick={click}
                        additional={additionalArray}
                        contextModal={{
                          route: "*/queue",
                          elements: combinedElements,
                        }}
                        wrapper={wrapper}
                      />
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </DragDropContext>
          </ContentWrapper>
        </SwipeDiv>
      </Fragment>
    ),
    [
      savedQueue,
      click,
      additionalArray,
      combinedElements,
      toggle,
      left,
      right,
      swipeHandler,
      wrapper,
      onDragEnd,
    ]
  );

  return jsx;
};

export default Queue;
