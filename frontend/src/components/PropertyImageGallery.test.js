import { fireEvent, render, screen } from "@testing-library/react";
import PropertyImageGallery from "./PropertyImageGallery";

test("selects thumbnails and closes the focused lightbox with Escape", () => {
  render(
    <PropertyImageGallery photos={'["one.jpg","two.jpg"]'} alt="Home" />
  );

  fireEvent.click(screen.getByRole("button", { name: "Show photo 2" }));
  expect(screen.getByRole("button", { name: "Open photo gallery" }).querySelector("img"))
    .toHaveAttribute("src", "two.jpg");

  fireEvent.click(screen.getByRole("button", { name: "Open photo gallery" }));
  const lightbox = screen.getByRole("dialog");
  expect(lightbox).toHaveFocus();

  fireEvent.keyDown(lightbox, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("closes the lightbox when the backdrop is clicked", () => {
  render(<PropertyImageGallery photos={'["one.jpg"]'} alt="Home" />);
  fireEvent.click(screen.getByRole("button", { name: "Open photo gallery" }));
  fireEvent.click(screen.getByRole("dialog"));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("lightbox arrow buttons cycle through photos", () => {
  render(
    <PropertyImageGallery photos={'["one.jpg","two.jpg"]'} alt="Home" />
  );
  fireEvent.click(screen.getByRole("button", { name: "Open photo gallery" }));
  fireEvent.click(screen.getByRole("button", { name: "Next photo" }));
  expect(screen.getByText("2 / 2")).toBeInTheDocument();
});
