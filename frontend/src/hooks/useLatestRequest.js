import { useCallback, useRef } from "react";

function useLatestRequest() {
  const requestId = useRef(0);

  const startRequest = useCallback(() => {
    requestId.current += 1;
    return requestId.current;
  }, []);

  const isLatestRequest = useCallback((id) => {
    return id === requestId.current;
  }, []);

  return { startRequest, isLatestRequest };
}

export default useLatestRequest;
