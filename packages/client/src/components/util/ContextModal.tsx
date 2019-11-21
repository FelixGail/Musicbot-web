import { Modal } from "antd";
import React, { ReactNode, useMemo, Children, useEffect } from "react";

export interface ContextModalProps {
  title?: string;
  visible?: boolean;
  elements: ContextModalElement[];
}

export interface ContextModalElement {
  element: ReactNode;
  onClick: (item: any) => void;
}

const wrapChildren = ({ element, onClick }: ContextModalElement) => {
  return (
    <li className="contextmodal-list-element">
      <div onClick={onClick}>{element}</div>
    </li>
  );
};

const ContextModal = ({ title, visible, elements }: ContextModalProps) => {
  const wrapped = useMemo(
    () => elements && elements.map(element => wrapChildren(element)),
    [elements]
  );

  return (
    <Modal className="contextmodal" centered visible={visible} title={title}>
      <ul className="contextmodal-list">{wrapped}</ul>
    </Modal>
  );
};

export default ContextModal;
