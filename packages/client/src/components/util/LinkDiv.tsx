import { LinkProps, Link } from "react-router-dom";
import React from "react";

const LinkDiv = ({ className, children, ...props }: LinkProps) => {
  return (
    <Link {...props}>
      <div className={className}>{children}</div>
    </Link>
  );
};

export default LinkDiv;
