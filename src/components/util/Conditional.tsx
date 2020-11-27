import React, { ReactNode, Fragment } from 'react';

export interface ConditionalProps {
  children: ReactNode;
  alt?: ReactNode;
  condition: boolean;
}

const Conditional = (props: ConditionalProps): JSX.Element => {
  return (
    <Fragment>{props.condition ? props.children : props.alt}</Fragment> || null
  );
};

export default Conditional;
