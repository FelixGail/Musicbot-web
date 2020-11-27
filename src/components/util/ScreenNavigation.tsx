import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

type clickFunction = () => void;
type ScreenNavigationAction = string | clickFunction;

export interface ScreenNavigationProps {
  left?: ScreenNavigationAction;
  right?: ScreenNavigationAction;
  center?: ScreenNavigationAction;
}

const ScreenNavigation = ({
  left,
  right,
  center,
}: ScreenNavigationProps): JSX.Element => {
  const jsx = useMemo(
    () => (
      <ScreenNavigationOuter>
        <ScreenNavigationItem
          size={30}
          action={left}
          className="screen-navigation-inner screen-navigation-left"
        />
        <ScreenNavigationItem
          size={40}
          action={center}
          className="screen-navigation-inner screen-navigation-center"
        />
        <ScreenNavigationItem
          size={30}
          action={right}
          className="screen-navigation-inner screen-navigation-right"
        />
      </ScreenNavigationOuter>
    ),
    [left, right, center],
  );

  return jsx;
};

const UnstyledScreenNavigationItem = ({
  className,
  children,
  action,
}: {
  action?: ScreenNavigationAction;
  className?: string;
  children?: React.ReactNode;
}): JSX.Element => {
  if (isString(action)) {
    return <Link className={className} children={children} to={action} />;
  }
  return <div className={className} children={children} onClick={action} />;
};

const isString = (f: unknown): f is string => {
  return typeof f === 'string';
};

const ScreenNavigationItem = styled(UnstyledScreenNavigationItem)`
  flex: ${(props: { size: number }) => props.size}%;
  cursor: default;
`;

const ScreenNavigationOuter = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;

export default ScreenNavigation;
