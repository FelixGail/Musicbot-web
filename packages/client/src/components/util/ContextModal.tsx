import { Modal } from "antd";
import React, { useMemo, ReactNode, useCallback } from "react";
import { ModalProps } from "antd/lib/modal";

export interface ContextModalProps<T> extends ModalProps {
  elements?: ContextModalElement<T>[];
  item: T;
}

export interface ContextModalElement<T> {
  element: (item: T) => ReactNode;
  onClick: (item: T) => void;
  close?: boolean;
}

export function ContextModal<T>({
  elements,
  item,
  ...props
}: ContextModalProps<T>) {
  const wrapChildren = useCallback(
    ({ element, onClick }: ContextModalElement<T>, index: number) => {
      return (
        <li className="contextmodal-list-element centering" key={index}>
          <div
            className="contextmodal-list-element-div centering"
            onClick={() => onClick(item)}
          >
            {element(item)}
          </div>
        </li>
      );
    },
    [item]
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
      <Modal className="contextmodal" {...props}>
          <ul className="contextmodal-list">{wrappedElements}</ul>
      </Modal>
    </div>
  );
}

export default ContextModal;
