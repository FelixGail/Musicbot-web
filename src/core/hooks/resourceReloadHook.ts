import { useResource, Arguments } from 'react-request-hook';
import { useEffect, useCallback, useRef, useState } from 'react';
import deepEqual from 'deep-equal';
import { getHookRequest, RequestConfig } from '../rest/operations';

/**
 * Periodically update a fetch function
 * @param resourceFunction A function that returns a ResourceConfig
 * @param defaultValue An initial value to set while no response is available
 * @param interval fetching interval
 * @param clearOnError clear data on request error
 * @param args further arguments needed to fetch the resource
 * @returns A tuple of an updating return value and a function to update the value manually
 */
export function useResourceReload<T>(
  resourceFunction: (...args: any[]) => RequestConfig<T>,
  defaultValue: T,
  interval: number,
  clearOnError: boolean,
  ...args: Arguments<(...args: any[]) => RequestConfig<T>>
): [T, (update: T) => void] {
  const [{ data, error, cancel, isLoading }, getResource] = useResource(
    getHookRequest(resourceFunction),
  );
  const [returnValue, setReturnValue] = useState(defaultValue);
  const dataRef = useRef(defaultValue);
  const defaultRef = useRef(defaultValue);
  const cancelRef = useRef<number>();
  const argsRef = useRef(args);

  defaultRef.current = defaultValue;
  argsRef.current = args;

  const reloadFunction = useCallback(() => {
    getResource(...argsRef.current);
    cancelRef.current = setTimeout(() => reloadFunction(), interval);
  }, [getResource, cancelRef, argsRef, interval]);

  const saveReturnValue = useCallback(
    (value: T) => {
      if (isLoading) {
        cancel();
      }
      setReturnValue(value);
    },
    [setReturnValue, cancel, isLoading],
  );

  useEffect(() => {
    if (data && !deepEqual(data, dataRef.current)) {
      dataRef.current = data;
      saveReturnValue(data);
    } else if (clearOnError && error) {
      dataRef.current = defaultRef.current;
      saveReturnValue(defaultRef.current);
    }
  }, [data, error, dataRef, defaultRef, clearOnError, saveReturnValue]);

  useEffect(() => {
    reloadFunction();

    return () => {
      if (cancelRef.current) {
        clearTimeout(cancelRef.current);
      }
    };
  }, [reloadFunction, cancelRef]);

  return [returnValue, saveReturnValue];
}
