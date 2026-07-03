const express = require("express");
const pool = require("../config/db");
const { buildPropertySearchQuery } = require("../utils/propertyQuery");

const router = express.Router();

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

module.exports = router;
