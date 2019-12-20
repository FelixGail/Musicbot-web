import { useState, useEffect, useRef } from "react";

function useUpdateOnChange<T>(
  equalFunction: (items?: T, other?: T) => boolean,
  defaultValue: T,
  isLoading: boolean,
  data?: T
): T {
  const [saved, setSaved] = useState<T>(defaultValue);
  useEffect(() => {
    if (!isLoading && !equalFunction(data, saved)) {
      console.log("unequal", data, saved);
      if (data) {
        setSaved(data);
      } else {
        setSaved(defaultValue);
      }
    }
  }, [equalFunction, data, defaultValue, saved, setSaved, isLoading]);

  return saved;
}

export default useUpdateOnChange;
