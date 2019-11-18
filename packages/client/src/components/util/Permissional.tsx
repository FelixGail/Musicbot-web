import React, { useMemo, useContext } from "react";
import { Permission } from "../../core/types";
import { ConfigurationContext } from "../../core/context/Configuration";
import Conditional from "./Conditional";

export interface PermissionalProps {
  children: JSX.Element;
  alt?: JSX.Element;
  permission: Permission;
}

const Permissional = ({ permission, ...props }: PermissionalProps) => {
  const { configuration } = useContext(ConfigurationContext);
  const condition = useMemo(
    () =>
      (configuration.permissions &&
        configuration.permissions.includes(permission)) ||
      false,
    [configuration.permissions, permission]
  );

  return <Conditional condition={condition} {...props} />;
};

export default Permissional;
