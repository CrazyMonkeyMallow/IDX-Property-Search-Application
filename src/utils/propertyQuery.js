const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const selectColumns = `
  L_ListingID AS listingId,
  L_Address AS address,
  L_City AS city,
  L_State AS state,
  L_Zip AS zipcode,
  L_SystemPrice AS price,
  L_Keyword2 AS beds,
  LM_Dec_3 AS baths,
  LM_Int2_3 AS sqft,
  L_Photos AS photos
`;

function parseNumber(value, name) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${name} must be a valid number`);
  }

  return parsed;
}

function buildPropertySearchQuery(query) {
  const limit = query.limit ? Number(query.limit) : DEFAULT_LIMIT;
  const offset = query.offset ? Number(query.offset) : 0;

  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    throw new Error("limit must be a number between 1 and 100");
  }

  if (!Number.isInteger(offset) || offset < 0) {
    throw new Error("offset must be a number greater than or equal to 0");
  }

  const conditions = [];
  const values = [];

  if (query.city) {
    conditions.push("LOWER(TRIM(L_City)) = LOWER(TRIM(?))");
    values.push(query.city);
  }

  if (query.zipcode) {
    conditions.push("L_Zip = ?");
    values.push(query.zipcode);
  }

  if (query.minPrice) {
    const minPrice = parseNumber(query.minPrice, "minPrice");

    if (minPrice < 0) {
      throw new Error("minPrice must be a valid number");
    }

    conditions.push("L_SystemPrice >= ?");
    values.push(minPrice);
  }

  if (query.maxPrice) {
    const maxPrice = parseNumber(query.maxPrice, "maxPrice");

    if (maxPrice < 0) {
      throw new Error("maxPrice must be a valid number");
    }

    conditions.push("L_SystemPrice <= ?");
    values.push(maxPrice);
  }

  if (query.beds) {
    const beds = parseNumber(query.beds, "beds");

    if (!Number.isInteger(beds) || beds < 1) {
      throw new Error("beds must be a positive whole number");
    }

    conditions.push("L_Keyword2 >= ?");
    values.push(beds);
  }

  if (query.baths) {
    const baths = parseNumber(query.baths, "baths");

    if (baths < 0) {
      throw new Error("baths must be a valid number");
    }

    conditions.push("LM_Dec_3 >= ?");
    values.push(baths);
  }

  const whereSql = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  return {
    limit,
    offset,
    countSql: `SELECT COUNT(*) AS total FROM rets_property ${whereSql}`,
    countValues: values,
    resultsSql: `
      SELECT
        ${selectColumns}
      FROM rets_property
      ${whereSql}
      ORDER BY L_ListingID
      LIMIT ? OFFSET ?
    `,
    resultsValues: [...values, limit, offset],
  };
}

module.exports = {
  buildPropertySearchQuery,
};
