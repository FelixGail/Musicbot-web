import React from 'react';
import PropTypes from 'prop-types';
import { useHistory, withRouter } from 'react-router';
import { Button } from 'antd';

const LinkButton = (props: any) => {
  const {
    to,
    onClick,
    // ⬆ filtering out props that `button` doesn’t know what to do with.
    ...rest
  } = props;
  const history = useHistory();
  return (
    <Button
      {...rest} // `children` is just another prop!
      onClick={(event) => {
        onClick && onClick(event);
        history.push(to);
      }}
    />
  );
};

LinkButton.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default withRouter(LinkButton);
