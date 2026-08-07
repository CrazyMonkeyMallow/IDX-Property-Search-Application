import { render, screen } from "@testing-library/react";
import OpenHouseList from "./OpenHouseList";

test("extracts remarks from the all_data JSON", () => {
  render(
    <OpenHouseList
      openHouses={[
        {
          id: 1,
          OpenHouseDate: "2026-06-20T07:00:00.000Z",
          OH_StartTime: "14:00:00",
          OH_EndTime: "16:00:00",
          all_data: JSON.stringify({ OpenHouseRemarks: "Meet the listing agent" }),
        },
      ]}
    />
  );

  expect(screen.getByText("Meet the listing agent")).toBeInTheDocument();
  expect(screen.getByText("2:00 PM - 4:00 PM")).toBeInTheDocument();
});

test("shows a message when no open houses are scheduled", () => {
  render(<OpenHouseList openHouses={[]} />);
  expect(screen.getByText("No open houses scheduled")).toBeInTheDocument();
});
