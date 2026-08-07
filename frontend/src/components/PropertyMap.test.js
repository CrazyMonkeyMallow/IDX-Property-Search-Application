import { render, screen } from "@testing-library/react";
import PropertyMap from "./PropertyMap";

test("renders the map and directions for valid coordinates", () => {
  process.env.REACT_APP_GOOGLE_MAPS_API_KEY = "test-key";
  render(<PropertyMap latitude="36.7" longitude="-121.2" />);

  expect(screen.getByTitle("Property location")).toHaveAttribute(
    "src",
    expect.stringContaining("q=36.7%2C-121.2")
  );
  expect(screen.getByRole("link", { name: "Get Directions" })).toHaveAttribute(
    "target",
    "_blank"
  );
});

test("does not render a map without both coordinates", () => {
  render(<PropertyMap latitude="36.7" longitude="" />);
  expect(screen.queryByTitle("Property location")).not.toBeInTheDocument();
});
