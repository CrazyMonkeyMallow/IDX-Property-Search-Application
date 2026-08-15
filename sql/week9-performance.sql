
CREATE INDEX idx_rets_property_price_beds_baths
  ON rets_property (L_SystemPrice, L_Keyword2, LM_Dec_3);


CREATE INDEX idx_rets_property_zip_price
  ON rets_property (L_Zip, L_SystemPrice);

