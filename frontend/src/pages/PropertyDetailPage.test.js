import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { fetchOpenHouses, fetchPropertyDetail } from "../api/client";
import PropertyDetailPage from "./PropertyDetailPage";

jest.mock("../api/client", () => ({
  fetchPropertyDetail: jest.fn(),
  fetchOpenHouses: jest.fn(),
}));

function renderDetail(path = "/property/A1") {
  render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/property/:id" element={<PropertyDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

afterEach(() => {
  jest.clearAllMocks();
});

test("shows an error for an invalid property ID", async () => {
  fetchPropertyDetail.mockRejectedValue(new Error("Property invalid-id was not found"));
  fetchOpenHouses.mockResolvedValue([]);
  renderDetail("/property/invalid-id");

  expect(
    await screen.findByText("Property invalid-id was not found")
  ).toBeInTheDocument();
});

test("shows the required property detail fields", async () => {
  fetchPropertyDetail.mockResolvedValue({
    L_ListingID: "A1",
    L_Address: "10 Main Street",
    L_City: "Austin",
    L_State: "TX",
    L_Zip: "78701",
    L_SystemPrice: 500000,
    L_Keyword2: 3,
    LM_Dec_3: 2,
    LM_Int2_3: 1800,
    YearBuilt: 2005,
    L_Remarks: "A welcoming home.",
    L_Type_: "SingleFamilyResidence",
    L_Status: "Active",
    L_Photos: "[]",
  });
  fetchOpenHouses.mockResolvedValue([]);
  renderDetail();

  expect(await screen.findByText("$500,000")).toBeInTheDocument();
  expect(screen.getByText("10 Main Street, Austin, TX, 78701")).toBeInTheDocument();
  expect(screen.getByText("A welcoming home.")).toBeInTheDocument();
  expect(screen.getByText("No open houses scheduled")).toBeInTheDocument();
});
