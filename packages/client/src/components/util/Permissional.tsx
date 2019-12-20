import React, { ReactNode } from "react";
import { Permission } from "../../core/types";
import Conditional from "./Conditional";
import useHasPermission from "../../core/hooks/useHasPermission";

export interface PermissionalProps {
  children: ReactNode;
  alt?: ReactNode;
  permission: Permission;
}

const Permissional = ({ permission, ...props }: PermissionalProps) => {
  const condition = useHasPermission(permission);

  return <Conditional condition={condition} {...props} />;
};

export default Permissional;
