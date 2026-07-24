import { fetchProperties } from "./client";

afterEach(() => {
  jest.restoreAllMocks();
});

test("fetchProperties returns the response body", async () => {
  const body = { total: 1, results: [{ listingId: "A1" }] };
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(body),
  });

  await expect(fetchProperties()).resolves.toEqual(body);
});

test("fetchProperties sends combined filters and omits empty values", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ results: [] }),
  });

  await fetchProperties({ city: "Austin", zipcode: "", beds: "3" });

  expect(global.fetch).toHaveBeenCalledWith(
    "/api/properties?city=Austin&beds=3"
  );
});

test("fetchProperties throws the API error message", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: false,
    status: 400,
    statusText: "Bad Request",
    json: jest.fn().mockResolvedValue({ message: "Invalid filters" }),
  });

  await expect(fetchProperties({ minPrice: "bad" })).rejects.toThrow(
    "Invalid filters"
  );
});
