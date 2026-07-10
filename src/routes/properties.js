const express = require("express");
const pool = require("../config/db");
const { buildPropertySearchQuery } = require("../utils/propertyQuery");

const router = express.Router();

function validateListingId(id) {
  if (!id || id.length > 64 || !/^[A-Za-z0-9_-]+$/.test(id)) {
    return "listing ID must be 1-64 letters, numbers, underscores, or hyphens";
  }

  return null;
}

router.get("/", async (req, res) => {
  let queryParts;

  try {
    queryParts = buildPropertySearchQuery(req.query);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }

  try {
    const [[countRow]] = await pool.query(
      queryParts.countSql,
      queryParts.countValues
    );

    const [results] = await pool.query(
      queryParts.resultsSql,
      queryParts.resultsValues
    );

    res.json({
      total: countRow.total,
      limit: queryParts.limit,
      offset: queryParts.offset,
      results,
    });
  } catch (error) {
    console.error("Property search failed:", error.message);

    res.status(500).json({
      status: "error",
      message: "Unable to fetch properties",
    });
  }
});

router.get("/:id/openhouses", async (req, res) => {
  const validationError = validateListingId(req.params.id);

  if (validationError) {
    return res.status(400).json({
      status: "error",
      message: validationError,
    });
  }

  try {
    const [properties] = await pool.query(
      "SELECT L_ListingID FROM rets_property WHERE L_ListingID = ? LIMIT 1",
      [req.params.id]
    );

    if (properties.length === 0) {
      return res.status(404).json({
        status: "error",
        message: `Property ${req.params.id} was not found`,
      });
    }

    const [openHouses] = await pool.query(
      `
      SELECT *
      FROM rets_openhouse
      WHERE L_ListingID = ?
      ORDER BY OpenHouseDate ASC, OH_StartTime ASC
      `,
      [req.params.id]
    );

    return res.json(openHouses);
  } catch (error) {
    console.error("Open house lookup failed:", error.message);

    return res.status(500).json({
      status: "error",
      message: "Unable to fetch open houses",
    });
  }
});

router.get("/:id", async (req, res) => {
  const validationError = validateListingId(req.params.id);

  if (validationError) {
    return res.status(400).json({
      status: "error",
      message: validationError,
    });
  }

  try {
    const [properties] = await pool.query(
      "SELECT * FROM rets_property WHERE L_ListingID = ? LIMIT 1",
      [req.params.id]
    );

    if (properties.length === 0) {
      return res.status(404).json({
        status: "error",
        message: `Property ${req.params.id} was not found`,
      });
    }

    return res.json(properties[0]);
  } catch (error) {
    console.error("Property lookup failed:", error.message);

    return res.status(500).json({
      status: "error",
      message: "Unable to fetch property",
    });
  }
});

module.exports = router;
