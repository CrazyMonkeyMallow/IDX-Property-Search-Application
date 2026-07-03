SET SESSION sql_mode = '';

CREATE INDEX idx_rets_property_city_normalized
  ON rets_property ((LOWER(TRIM(L_City))));

CREATE INDEX idx_rets_property_zip
  ON rets_property (L_Zip);

CREATE INDEX idx_rets_property_price
  ON rets_property (L_SystemPrice);

CREATE INDEX idx_rets_property_beds
  ON rets_property (L_Keyword2);

CREATE INDEX idx_rets_property_baths
  ON rets_property (LM_Dec_3);

CREATE INDEX idx_rets_property_city_price_beds
  ON rets_property ((LOWER(TRIM(L_City))), L_SystemPrice, L_Keyword2);
