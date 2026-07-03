const assert = require("node:assert/strict");
const test = require("node:test");
const { buildPropertySearchQuery } = require("../src/utils/propertyQuery");

test("minPrice and beds filters keep SQL placeholders and values in the same order", () => {
  const queryParts = buildPropertySearchQuery({
    minPrice: "300000",
    beds: "3",
    limit: "20",
    offset: "0",
  });

  assert.match(queryParts.countSql, /L_SystemPrice >= \?/);
  assert.match(queryParts.countSql, /L_Keyword2 >= \?/);
  assert.deepEqual(queryParts.countValues, [300000, 3]);
  assert.deepEqual(queryParts.resultsValues, [300000, 3, 20, 0]);
});

test("invalid minPrice returns a validation error", () => {
  assert.throws(
    () => buildPropertySearchQuery({ minPrice: "abc" }),
    /minPrice must be a valid number/
  );
});

test("invalid limit values return validation errors", () => {
  assert.throws(
    () => buildPropertySearchQuery({ limit: "0" }),
    /limit must be a number between 1 and 100/
  );

  assert.throws(
    () => buildPropertySearchQuery({ limit: "200" }),
    /limit must be a number between 1 and 100/
  );
});
