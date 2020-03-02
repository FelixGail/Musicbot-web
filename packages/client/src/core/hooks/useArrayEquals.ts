import { useCallback } from "react";

function useArrayEquals<T>(equals: (item: T, other: T) => boolean) {
  const callback = useCallback(
    (a?: T[], b?: T[]) => {
      if (a === b) return true;
      if (a && b) {
        if (a.length !== b.length) return false;
        for (var i = 0; i < a.length; ++i) {
          if (!equals(a[i], b[i])) return false;
        }
      }
      return true;
    },
    [equals]
  );

  return callback;
}

export default useArrayEquals;
