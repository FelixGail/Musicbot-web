import { useResource, Resource } from "react-request-hook";
import { useEffect, useCallback, useRef } from "react";
import deepEqual from "deep-equal";


export function useResourceReload<T>(resourceFunction: () => Resource<T>, defaultValue: T, interval: number = 1000): T {
    const [{data}, getResource] = useResource(resourceFunction)
    const dataRef = useRef(defaultValue)
    const cancelRef = useRef<NodeJS.Timeout | undefined>()

    const reloadFunction = useCallback(() => {
        getResource()
        cancelRef.current = setTimeout(() => reloadFunction(), interval)
    }, [interval, getResource, cancelRef])

    useEffect(() => {
        if(data && !deepEqual(data, dataRef.current)) {
            dataRef.current = data
        }
    }, [data, dataRef])

    useEffect(() => {
        reloadFunction()

        return () => {
            if(cancelRef.current) {
                clearTimeout(cancelRef.current)
            }
        }
    }, [reloadFunction, cancelRef])

    return dataRef.current
}
