import {useResource, Arguments, Resource} from 'react-request-hook';
import {useEffect, useCallback, useRef, useState} from 'react';
import deepEqual from 'deep-equal';

export function useResourceReload<T>(
    resourceFunction: (...args: any[]) => Resource<T>,
    defaultValue: T,
    interval: number,
    clearOnError: boolean,
    ...args: Arguments<(...args: any[]) => Resource<T>>
): T {
  const [{data, error}, getResource] = useResource(resourceFunction);
  const [returnValue, setReturnValue] = useState(defaultValue);
  const dataRef = useRef(defaultValue);
  const argsRef = useRef(args);
  const cancelRef = useRef<number>();

  const reloadFunction = useCallback(() => {
    getResource(...argsRef.current);
    cancelRef.current = setTimeout(() => reloadFunction(), interval);
  }, [getResource, cancelRef, argsRef, interval]);

  useEffect(() => {
    if (data && !deepEqual(data, dataRef.current)) {
      dataRef.current = data;
      setReturnValue(data);
    } else if (clearOnError && error) {
      dataRef.current = defaultValue
      setReturnValue(defaultValue)
    } 
  }, [data, error, dataRef, defaultValue, clearOnError, setReturnValue]);

  useEffect(() => {
    reloadFunction();

    return () => {
      if (cancelRef.current) {
        clearTimeout(cancelRef.current);
      }
    };
  }, [reloadFunction, cancelRef]);

  return returnValue;
}
