import { useResource, Arguments, Resource } from 'react-request-hook';
import { useEffect, useCallback, useRef, useState } from 'react';
import deepEqual from 'deep-equal';
import { getHookRequest, RequestConfig } from '../api/model';

export function useResourceReload<T>(
	resourceFunction: (...args: any[]) => RequestConfig<T>,
	defaultValue: T,
	interval: number,
	clearOnError: boolean,
	...args: Arguments<(...args: any[]) => RequestConfig<T>>
): T {
	const [ { data, error }, getResource ] = useResource(getHookRequest(resourceFunction));
	const [ returnValue, setReturnValue ] = useState(defaultValue);
	const dataRef = useRef(defaultValue);
	const defaultRef = useRef(defaultValue);
	const cancelRef = useRef<number>();
	const argsRef = useRef(args);

	defaultRef.current = defaultValue;
	argsRef.current = args;

	const reloadFunction = useCallback(
		() => {
			getResource(...argsRef.current);
			cancelRef.current = setTimeout(() => reloadFunction(), interval);
		},
		[ getResource, cancelRef, argsRef, interval ]
	);

	useEffect(
		() => {
			if (data && !deepEqual(data, dataRef.current)) {
				dataRef.current = data;
				setReturnValue(data);
			} else if (clearOnError && error) {
				dataRef.current = defaultRef.current;
				setReturnValue(defaultRef.current);
			}
		},
		[ data, error, dataRef, defaultRef, clearOnError, setReturnValue ]
	);

	useEffect(
		() => {
			reloadFunction();

			return () => {
				if (cancelRef.current) {
					clearTimeout(cancelRef.current);
				}
			};
		},
		[ reloadFunction, cancelRef ]
	);

	return returnValue;
}
