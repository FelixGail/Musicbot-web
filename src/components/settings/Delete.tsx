import React from "react";
import { useUserDelete } from "../../core/hooks/user";
import { DangerButton } from "./Styles";

export const Delete = () => {
  const deleteUser = useUserDelete();
  return <DangerButton onClick={deleteUser}>Delete User</DangerButton>;
};
