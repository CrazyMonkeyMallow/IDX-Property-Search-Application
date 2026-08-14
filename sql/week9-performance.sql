-- Week 9 performance notes.
-- Run EXPLAIN before and after these indexes on the target MySQL database.

-- Common range filters used with price, beds, and baths.
CREATE INDEX idx_rets_property_price_beds_baths
  ON rets_property (L_SystemPrice, L_Keyword2, LM_Dec_3);

-- ZIP searches commonly include a price range.
CREATE INDEX idx_rets_property_zip_price
  ON rets_property (L_Zip, L_SystemPrice);

-- Baseline query to inspect with EXPLAIN:
-- EXPLAIN SELECT L_ListingID, L_SystemPrice, L_Keyword2, LM_Dec_3
-- FROM rets_property
-- WHERE LOWER(TRIM(L_City)) = LOWER(TRIM('Austin'))
--   AND L_SystemPrice >= 300000
--   AND L_Keyword2 >= 3
-- ORDER BY L_SystemPrice ASC, L_ListingID
-- LIMIT 20 OFFSET 0;

-- EXPLAIN columns to record:
-- type: access strategy; ALL means a full table scan, range/ref are preferable.
-- possible_keys: indexes MySQL considers usable.
-- key: index MySQL actually selected.
-- rows: estimated rows examined.
-- Extra: watch for Using filesort or Using temporary.
