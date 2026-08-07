import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOpenHouses, fetchPropertyDetail } from "../api/client";
import OpenHouseList from "../components/OpenHouseList";
import PropertyImageGallery from "../components/PropertyImageGallery";
import PropertyMap from "../components/PropertyMap";

function formatPrice(value) {
  const price = Number(value);
  if (!Number.isFinite(price)) return "Price unavailable";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function displayValue(value) {
  return value === null || value === undefined || value === "" ? "-" : value;
}

function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadProperty() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const [propertyData, openHouseData] = await Promise.all([
          fetchPropertyDetail(id),
          fetchOpenHouses(id),
        ]);

        if (isCurrent) {
          setProperty(propertyData);
          setOpenHouses(openHouseData || []);
        }
      } catch (error) {
        if (isCurrent) setErrorMessage(error.message || "Unable to load property");
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadProperty();
    return () => {
      isCurrent = false;
    };
  }, [id]);

  if (isLoading) {
    return <main className="property-detail"><div className="status-panel">Loading property...</div></main>;
  }

  if (errorMessage || !property) {
    return (
      <main className="property-detail">
        <button type="button" className="back-button" onClick={() => navigate("/")}>
          Back to listings
        </button>
        <div className="status-panel status-panel--error">
          {errorMessage || "Property not found"}
        </div>
      </main>
    );
  }

  const address = [property.L_Address, property.L_City, property.L_State, property.L_Zip]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="property-detail">
      <button type="button" className="back-button" onClick={() => navigate("/")}>
        Back to listings
      </button>

      <PropertyImageGallery photos={property.L_Photos} alt={property.L_Address || "Property"} />

      <header className="property-detail__header">
        <h1>{formatPrice(property.L_SystemPrice)}</h1>
        <p>{address || "Address unavailable"}</p>
      </header>

      <dl className="property-detail__stats">
        <div><dt>Beds</dt><dd>{displayValue(property.L_Keyword2)}</dd></div>
        <div><dt>Baths</dt><dd>{displayValue(property.LM_Dec_3)}</dd></div>
        <div><dt>Sqft</dt><dd>{displayValue(property.LM_Int2_3)}</dd></div>
        <div><dt>Year built</dt><dd>{displayValue(property.YearBuilt)}</dd></div>
      </dl>

      <section className="property-detail__section">
        <h2>Description</h2>
        <p>{property.L_Remarks || "No description available"}</p>
      </section>

      <section className="property-detail__section">
        <h2>Property Details</h2>
        <dl className="property-details-list">
          <div><dt>Listing ID</dt><dd>{displayValue(property.L_ListingID)}</dd></div>
          <div><dt>Property type</dt><dd>{displayValue(property.L_Type_)}</dd></div>
          <div><dt>Status</dt><dd>{displayValue(property.L_Status)}</dd></div>
          <div><dt>Lot size</dt><dd>{property.LotSizeAcres ? `${property.LotSizeAcres} acres` : "-"}</dd></div>
          <div><dt>County</dt><dd>{displayValue(property.CountyOrParish)}</dd></div>
        </dl>
      </section>

      <OpenHouseList openHouses={openHouses} />
      <PropertyMap
        latitude={property.LMD_MP_Latitude}
        longitude={property.LMD_MP_Longitude}
      />
    </main>
  );
}

export default PropertyDetailPage;
