import { Modal } from "antd";
import React, { useMemo, ReactNode, useRef, useCallback } from "react";
import { ModalProps } from "antd/lib/modal";
import { useClickAway } from "react-use";

export interface ContextModalProps<T> extends ModalProps {
  elements?: ContextModalElement<T>[];
  item: T;
  clickAway?: () => void;
}

export interface ContextModalElement<T> {
  element: (item: T) => ReactNode;
  onClick: (item: T) => void;
  close?: boolean;
}

export function ContextModal<T>({
  elements,
  clickAway,
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

  const ref = useRef(null);
  useClickAway(ref, clickAway || (() => {}));

  return (
    <Modal className="contextmodal" {...props}>
      <div ref={ref}>
        <ul className="contextmodal-list">{wrappedElements}</ul>
      </div>
    </Modal>
  );
}

export default ContextModal;
