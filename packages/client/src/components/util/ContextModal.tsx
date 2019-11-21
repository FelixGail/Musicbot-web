import { Modal } from "antd";
import React, { useState, useMemo, useEffect, ReactNode } from "react";

export interface ContextModalProps {
  title?: string;
  visible?: boolean;
  elements?: ContextModalElement[];
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

export const ContextModal = ({
  title,
  visible,
  elements
}: ContextModalProps) => {
  const [visibleState, setVisible] = useState(false);
  useEffect(() => {
    setVisible(visible || false);
  }, [visible, setVisible]);

  const closeLink = useMemo(() => {
    return wrapChildren({ element: "close", onClick: () => setVisible(false) });
  }, [setVisible]);

  return (
    <Modal
      className="contextmodal"
      centered
      visible={visibleState}
      title={title}
    >
      <ul className="contextmodal-list">
        {elements && elements.map(element => wrapChildren(element))}
        {closeLink}
      </ul>
    </Modal>
  );
};

export default ContextModal;
