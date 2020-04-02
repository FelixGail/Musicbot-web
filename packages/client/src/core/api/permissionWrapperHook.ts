import {
  useResource,
  Request,
  Arguments,
  Payload,
  RequestError
} from "react-request-hook";
import { Permission } from "../types";
import { useContext, useCallback } from "react";
import { ConfigurationContext } from "../context/Configuration";
import { Canceler } from "axios";

type RequestState<TRequest extends Request> = {
  data?: Payload<TRequest>;
  error?: RequestError;
  isLoading: boolean;
};
type PermissionResourceResult<
  TRequest extends Request,
  FunctionParam extends any[]
> = [
  RequestState<TRequest> & { cancel: Canceler },
  (
    functionValues: FunctionParam,
    ...values: Arguments<TRequest>
  ) => Canceler | false
];

function useResourceWithPermission<
  TRequest extends Request,
  FunctionParam extends any[]
>(
  fn: TRequest,
  permission: Permission,
  and?: (username: string, ...params: FunctionParam) => boolean,
  or?: (username: string, ...params: FunctionParam) => boolean,
  defaultParams?: Arguments<TRequest>
): PermissionResourceResult<TRequest, FunctionParam> {
  const [{ data, isLoading, error, cancel }, call] = useResource(
    fn,
    defaultParams
  );
  const { configuration } = useContext(ConfigurationContext);

  const wrapper = useCallback(
    (functionValues: FunctionParam, ...values: Arguments<TRequest>) => {
      if (
        (configuration.permissions &&
          configuration.permissions.includes(permission) &&
          (!and || and(configuration.username!, ...functionValues))) ||
        (or && or(configuration.username!, ...functionValues))
      ) {
        return call(...values);
      }
      return false;
    },
    [configuration, call, and, or, permission]
  );

  return [{ data, isLoading, error, cancel }, wrapper];
}

export default useResourceWithPermission;
