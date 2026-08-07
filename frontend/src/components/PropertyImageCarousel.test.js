import { fireEvent, render, screen } from "@testing-library/react";
import PropertyImageCarousel from "./PropertyImageCarousel";

test("cycles photos without triggering the card click", () => {
  const onCardClick = jest.fn();
  render(
    <div onClick={onCardClick}>
      <PropertyImageCarousel photos={'["one.jpg","two.jpg"]'} alt="Home" />
    </div>
  );

  expect(screen.getByText("1 / 2")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Next photo" }));

  expect(screen.getByText("2 / 2")).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Home" })).toHaveAttribute(
    "src",
    "two.jpg"
  );
  expect(onCardClick).not.toHaveBeenCalled();
});

test("falls back safely when photos contain invalid JSON", () => {
  render(<PropertyImageCarousel photos="not-json" alt="Home" />);
  expect(screen.getByText("No photo")).toBeInTheDocument();
});
