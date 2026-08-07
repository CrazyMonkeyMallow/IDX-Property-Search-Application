import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PropertyCard from "./PropertyCard";

test("links the property card to its detail route", () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <PropertyCard
        property={{
          listingId: "A-123",
          address: "10 Main Street",
          city: "Austin",
          state: "TX",
          price: 500000,
          photos: "[]",
        }}
      />
    </MemoryRouter>
  );

  expect(screen.getByRole("link", { name: "View 10 Main Street" })).toHaveAttribute(
    "href",
    "/property/A-123"
  );
});
