import React, { useMemo } from "react";
import LinkDiv from "./LinkDiv";

type clickFunction = () => void;
type ScreenNavigationItem = string | clickFunction;

export interface ScreenNavigationProps {
  left?: ScreenNavigationItem;
  right?: ScreenNavigationItem;
  center?: ScreenNavigationItem;
}

const ScreenNavigation = ({ left, right, center }: ScreenNavigationProps) => {
  const jsx = useMemo(
    () => (
      <div className="screen-navigation">
        <ScreenNavigationItem
          action={left}
          className="screen-navigation-inner screen-navigation-left"
        />
        <ScreenNavigationItem
          action={center}
          className="screen-navigation-inner screen-navigation-center"
        />
        <ScreenNavigationItem
          action={right}
          className="screen-navigation-inner screen-navigation-right"
        />
      </div>
    ),
    [left, right, center]
  );

  return jsx;
};

const ScreenNavigationItem = ({
  className,
  children,
  action
}: {
  action?: ScreenNavigationItem;
  className?: string;
  children?: React.ReactNode;
}) => {
  if (isString(action)) {
    return <LinkDiv className={className} children={children} to={action} />;
  }
  return <div className={className} children={children} onClick={action} />;
};

const isString = (f: any): f is String => {
  return typeof f === "string";
};

export default ScreenNavigation;
