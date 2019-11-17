import { RequestDispatcher, Request } from "react-request-hook";
import { useEffect, useState } from "react";

function useReload(dispatcher: RequestDispatcher<Request>, time?: number) {
  const [reload, triggerReload] = useState(false);

  useEffect(() => {
    dispatcher();
    const ref = setTimeout(() => triggerReload(!reload), time || 1000);
    return () => clearTimeout(ref);
  }, [dispatcher, reload, triggerReload, time]);
}

export default useReload;
