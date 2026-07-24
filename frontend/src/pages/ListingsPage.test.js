import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { fetchProperties } from "../api/client";
import ListingsPage from "./ListingsPage";

jest.mock("../api/client", () => ({
  fetchProperties: jest.fn(),
}));

function deferred() {
  let resolve;
  const promise = new Promise((promiseResolve) => {
    resolve = promiseResolve;
  });
  return { promise, resolve };
}

afterEach(() => {
  jest.clearAllMocks();
});

test("a newer search ignores results from an older request", async () => {
  fetchProperties.mockResolvedValueOnce({ total: 0, limit: 20, results: [] });
  render(<ListingsPage />);

  await screen.findByText(/No properties found/);

  const firstSearch = deferred();
  const clearSearch = deferred();
  const secondSearch = deferred();
  fetchProperties
    .mockReturnValueOnce(firstSearch.promise)
    .mockReturnValueOnce(clearSearch.promise)
    .mockReturnValueOnce(secondSearch.promise);

  const cityInput = screen.getByLabelText("City");
  fireEvent.change(cityInput, { target: { value: "Austin" } });
  fireEvent.click(screen.getByRole("button", { name: "Search" }));
  fireEvent.click(screen.getByRole("button", { name: "Clear Filters" }));
  fireEvent.change(cityInput, { target: { value: "Dallas" } });
  fireEvent.click(screen.getByRole("button", { name: "Search" }));

  firstSearch.resolve({
    total: 1,
    limit: 20,
    results: [{ listingId: "A1", address: "Old result" }],
  });
  clearSearch.resolve({ total: 0, limit: 20, results: [] });
  secondSearch.resolve({
    total: 1,
    limit: 20,
    results: [{ listingId: "D1", address: "New result" }],
  });

  expect(await screen.findByText("New result")).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByText("Old result")).not.toBeInTheDocument();
  });
});
