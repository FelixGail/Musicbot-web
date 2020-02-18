import { useResource, Request } from "react-request-hook";
import useReload from "./reloadHook";
import useUpdateOnChange from "./useUpdateOnChange";

function useEquallingReload<T>(
  fn: Request,
  equalFunction: (items?: T, other?: T) => boolean,
  defaultValue: T
) {
  const [{ data, isLoading }, call] = useResource(fn);
  useReload(call);
  const checked = useUpdateOnChange(
    equalFunction,
    defaultValue,
    isLoading,
    data
  );

  return checked;
}

export default useEquallingReload;
