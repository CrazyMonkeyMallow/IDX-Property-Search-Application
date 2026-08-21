const request = require("supertest");

// Mock the pool so route tests are deterministic and never require MySQL.
jest.mock("../src/config/db", () => ({ query: jest.fn() }));

const pool = require("../src/config/db");
const app = require("../src/server");

afterEach(() => {
  pool.query.mockReset();
});

test("GET /api/properties returns paginated results", async () => {
  pool.query
    .mockResolvedValueOnce([[{ total: 2 }]])
    .mockResolvedValueOnce([[{ listingId: "A1", price: 100000 }]]);

  const response = await request(app)
    .get("/api/properties?limit=1&offset=1&sortBy=L_SystemPrice&sortOrder=asc")
    .expect(200);

  expect(response.body).toEqual({
    total: 2,
    limit: 1,
    offset: 1,
    results: [{ listingId: "A1", price: 100000 }],
  });
  expect(pool.query).toHaveBeenCalledTimes(2);
});

test.each([
  ["city", "Austin"],
  ["zipcode", "78701"],
  ["minPrice", "300000"],
  ["maxPrice", "600000"],
  ["beds", "3"],
  ["baths", "2"],
])("GET /api/properties accepts the %s filter", async (name, value) => {
  pool.query
    .mockResolvedValueOnce([[{ total: 0 }]])
    .mockResolvedValueOnce([[]]);

  await request(app).get(`/api/properties?${name}=${value}`).expect(200);
  expect(pool.query.mock.calls[0][0]).toContain("SELECT COUNT(*)");
});

test("GET /api/properties rejects invalid input with 400", async () => {
  const response = await request(app)
    .get("/api/properties?sortBy=ListPrice")
    .expect(400);

  expect(response.body.message).toMatch(/supported property column/);
  expect(pool.query).not.toHaveBeenCalled();
});

test("GET /api/properties returns 500 when the database fails", async () => {
  pool.query.mockRejectedValue(new Error("database unavailable"));

  await request(app).get("/api/properties").expect(500, {
    status: "error",
    message: "Unable to fetch properties",
  });
});

test("GET /api/properties/:id returns one property", async () => {
  pool.query.mockResolvedValueOnce([[{ L_ListingID: "A1", L_Address: "10 Main" }]]);

  await request(app)
    .get("/api/properties/A1")
    .expect(200, { L_ListingID: "A1", L_Address: "10 Main" });
});

test("GET /api/properties/:id returns 404 for an unknown property", async () => {
  pool.query.mockResolvedValueOnce([[]]);
  await request(app).get("/api/properties/unknown").expect(404);
});

test("GET /api/properties/:id rejects an invalid ID", async () => {
  await request(app).get("/api/properties/bad%20id").expect(400);
  expect(pool.query).not.toHaveBeenCalled();
});

test("GET /api/properties/:id/openhouses returns open houses", async () => {
  pool.query
    .mockResolvedValueOnce([[{ L_ListingID: "A1" }]])
    .mockResolvedValueOnce([[{ L_ListingID: "A1", OH_StartTime: "10:00:00" }]]);

  await request(app)
    .get("/api/properties/A1/openhouses")
    .expect(200, [{ L_ListingID: "A1", OH_StartTime: "10:00:00" }]);
});

test("GET /api/properties/:id/openhouses returns an empty list", async () => {
  pool.query
    .mockResolvedValueOnce([[{ L_ListingID: "A1" }]])
    .mockResolvedValueOnce([[]]);

  await request(app).get("/api/properties/A1/openhouses").expect(200, []);
});

test("GET /api/properties/:id/openhouses returns 404 for an unknown property", async () => {
  pool.query.mockResolvedValueOnce([[]]);
  await request(app).get("/api/properties/unknown/openhouses").expect(404);
});
