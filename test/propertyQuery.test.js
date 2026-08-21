const { buildPropertySearchQuery } = require("../src/utils/propertyQuery");

test("minPrice and beds keep SQL placeholders and values in order", () => {
  const query = buildPropertySearchQuery({ minPrice: "300000", beds: "3", limit: "20", offset: "0" });
  expect(query.countSql).toMatch(/L_SystemPrice >= \?/);
  expect(query.countSql).toMatch(/L_Keyword2 >= \?/);
  expect(query.countValues).toEqual([300000, 3]);
  expect(query.resultsValues).toEqual([300000, 3, 20, 0]);
});

test("rejects invalid numeric and pagination values", () => {
  expect(() => buildPropertySearchQuery({ minPrice: "abc" })).toThrow(/minPrice/);
  expect(() => buildPropertySearchQuery({ limit: "0" })).toThrow(/limit/);
  expect(() => buildPropertySearchQuery({ limit: "200" })).toThrow(/limit/);
});

test("builds a whitelisted sort expression", () => {
  const query = buildPropertySearchQuery({ sortBy: "L_SystemPrice", sortOrder: "desc" });
  expect(query.resultsSql).toMatch(/ORDER BY L_SystemPrice DESC, L_ListingID/);
});

test("rejects invalid sort fields and directions", () => {
  expect(() => buildPropertySearchQuery({ sortBy: "ListPrice" })).toThrow(/supported property column/);
  expect(() => buildPropertySearchQuery({ sortOrder: "sideways" })).toThrow(/asc or desc/);
});
