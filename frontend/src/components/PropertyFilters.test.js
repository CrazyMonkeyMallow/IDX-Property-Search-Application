import { fireEvent, render, screen } from "@testing-library/react";
import PropertyFilters from "./PropertyFilters";

function renderFilters(props = {}) {
  const onSearch = jest.fn();
  const onClear = jest.fn();
  render(<PropertyFilters onSearch={onSearch} onClear={onClear} {...props} />);
  return { onSearch, onClear };
}

test("displays all six filter inputs", () => {
  renderFilters();

  expect(screen.getByLabelText("City")).toBeInTheDocument();
  expect(screen.getByLabelText("ZIP code")).toBeInTheDocument();
  expect(screen.getByLabelText("Min price")).toBeInTheDocument();
  expect(screen.getByLabelText("Max price")).toBeInTheDocument();
  expect(screen.getByLabelText("Beds")).toBeInTheDocument();
  expect(screen.getByLabelText("Baths")).toBeInTheDocument();
});

test("submits combined filters without empty values", () => {
  const { onSearch } = renderFilters();

  fireEvent.change(screen.getByLabelText("City"), {
    target: { value: "Austin" },
  });
  fireEvent.change(screen.getByLabelText("Beds"), {
    target: { value: "3" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Search" }));

  expect(onSearch).toHaveBeenCalledWith({ city: "Austin", beds: "3" });
});

test("clear resets every input and reloads all properties", () => {
  const { onClear } = renderFilters();
  const cityInput = screen.getByLabelText("City");
  const bathsSelect = screen.getByLabelText("Baths");

  fireEvent.change(cityInput, { target: { value: "Dallas" } });
  fireEvent.change(bathsSelect, { target: { value: "2" } });
  fireEvent.click(screen.getByRole("button", { name: "Clear Filters" }));

  expect(cityInput).toHaveValue("");
  expect(bathsSelect).toHaveValue("");
  expect(onClear).toHaveBeenCalledTimes(1);
});
