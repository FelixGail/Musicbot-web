import { useMemo } from "react";

function useTypedDefault<T>(value: T | undefined | null, defaultValue: T) {
  return useMemo(() => {
    if (value === undefined || value === null) {
      return defaultValue;
    }
    return value;
  }, [value, defaultValue]);
}

export default useTypedDefault;
