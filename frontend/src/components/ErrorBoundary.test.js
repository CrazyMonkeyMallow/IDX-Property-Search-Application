import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

function BrokenComponent() {
  throw new Error("render failed");
}

test("shows recovery UI when a child throws during render", () => {
  const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <BrokenComponent />
    </ErrorBoundary>
  );

  expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Reload page" })).toBeInTheDocument();
  consoleError.mockRestore();
});
