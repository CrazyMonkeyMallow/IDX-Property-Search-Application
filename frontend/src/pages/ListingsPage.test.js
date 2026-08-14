import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { fetchProperties } from "../api/client";
import ListingsPage from "./ListingsPage";

jest.mock("../api/client", () => ({
  fetchProperties: jest.fn(),
}));

function TestRouter({ children }) {
  return (
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      {children}
    </MemoryRouter>
  );
}

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

beforeEach(() => {
  window.scrollTo = jest.fn();
});

test("a newer search ignores results from an older request", async () => {
  fetchProperties.mockResolvedValueOnce({ total: 0, limit: 20, results: [] });
  render(<ListingsPage />, { wrapper: TestRouter });

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

test("page changes preserve filters and new filters reset to page one", async () => {
  fetchProperties.mockImplementation((params) =>
    Promise.resolve({
      total: 60,
      limit: 20,
      results: [
        {
          listingId: `${params.city || "all"}-${params.offset}`,
          address: `${params.city || "All"} page result`,
        },
      ],
    })
  );

  render(<ListingsPage />, { wrapper: TestRouter });
  await screen.findByText("Showing 1-20 of 60 properties");

  const cityInput = screen.getByLabelText("City");
  fireEvent.change(cityInput, { target: { value: "Austin" } });
  fireEvent.click(screen.getByRole("button", { name: "Search" }));

  await waitFor(() => {
    expect(fetchProperties).toHaveBeenLastCalledWith({
      city: "Austin",
      limit: 20,
      offset: 0,
      sortBy: "L_SystemPrice",
      sortOrder: "asc",
    });
  });

  fireEvent.change(screen.getByLabelText("Sort by"), {
    target: { value: "ListingContractDate" },
  });
  fireEvent.change(screen.getByLabelText("Order"), {
    target: { value: "desc" },
  });

  await waitFor(() => {
    expect(fetchProperties).toHaveBeenLastCalledWith({
      city: "Austin",
      limit: 20,
      offset: 0,
      sortBy: "ListingContractDate",
      sortOrder: "desc",
    });
  });

  fireEvent.click(screen.getByRole("button", { name: "2" }));

  await waitFor(() => {
    expect(fetchProperties).toHaveBeenLastCalledWith({
      city: "Austin",
      limit: 20,
      offset: 20,
      sortBy: "ListingContractDate",
      sortOrder: "desc",
    });
  });
  expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  expect(screen.getByText("Showing 21-40 of 60 properties")).toBeInTheDocument();

  fireEvent.change(cityInput, { target: { value: "Dallas" } });
  fireEvent.click(screen.getByRole("button", { name: "Search" }));

  await waitFor(() => {
    expect(fetchProperties).toHaveBeenLastCalledWith({
      city: "Dallas",
      limit: 20,
      offset: 0,
      sortBy: "L_SystemPrice",
      sortOrder: "asc",
    });
  });
  expect(screen.getByText("Showing 1-20 of 60 properties")).toBeInTheDocument();
});
