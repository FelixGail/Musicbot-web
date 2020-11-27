import { Modal } from 'antd';
import React, { useMemo, ReactNode, useCallback } from 'react';
import { ModalProps } from 'antd/lib/modal';
import styled from 'styled-components';

export interface ContextModalProps<T> extends ModalProps {
  elements?: ContextModalElement<T>[];
  item: T;
}

export interface ContextModalElement<T> {
  element: (item: T) => ReactNode;
  onClick?: (item: T) => void;
  close?: boolean;
}

const StyledModal = styled(Modal)`
  min-width: 300px;
  width: auto !important;

  .ant-modal-header {
    padding: 10px 20px 10px 20px;
  }

  .ant-modal-title {
    font-weight: bolder;
    color: #949494;
  }

  .ant-modal-body {
    padding: 10px 0px;
  }
`;

const ContextModalList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 100%;
`;

const ContextModalListItem = styled.li`
  div:not(:empty) {
    padding: 4px 20px;
  }

  &:hover {
    color: #1890ff;
    background-color: #cccccc;
  }
`;

const ContextModalListItemDiv = styled.div`
  font-weight: bold;
  cursor: pointer;
`;

export function ContextModal<T>({
  elements,
  item,
  ...props
}: ContextModalProps<T>) {
  const wrapChildren = useCallback(
    ({ element, onClick }: ContextModalElement<T>, index: number) => {
      return (
        <ContextModalListItem key={index}>
          <ContextModalListItemDiv onClick={() => onClick && onClick(item)}>
            {element(item)}
          </ContextModalListItemDiv>
        </ContextModalListItem>
      );
    },
    [item],
  );
  const wrappedElements = useMemo(() => {
    return (
      (elements &&
        elements.map((element, index) => wrapChildren(element, index))) ||
      []
    );
  }, [elements, wrapChildren]);

  return (
    <div>
      <StyledModal {...props}>
        <ContextModalList>{wrappedElements}</ContextModalList>
      </StyledModal>
    </div>
  );
}

export default ContextModal;
