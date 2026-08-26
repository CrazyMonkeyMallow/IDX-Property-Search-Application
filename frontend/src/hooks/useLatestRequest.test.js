import { act, renderHook } from "@testing-library/react";
import useLatestRequest from "./useLatestRequest";

test("only marks the newest request as current", () => {
  const { result } = renderHook(() => useLatestRequest());
  let firstRequest;
  let secondRequest;

  act(() => {
    firstRequest = result.current.startRequest();
    secondRequest = result.current.startRequest();
  });

  expect(result.current.isLatestRequest(firstRequest)).toBe(false);
  expect(result.current.isLatestRequest(secondRequest)).toBe(true);
});
