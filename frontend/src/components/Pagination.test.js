import { fireEvent, render, screen, within } from "@testing-library/react";
import Pagination from "./Pagination";

function renderPagination(props = {}) {
  const onPageChange = jest.fn();
  render(
    <Pagination
      currentPage={1}
      totalPages={10}
      onPageChange={onPageChange}
      {...props}
    />
  );
  return onPageChange;
}

test("hides pagination when there is only one page", () => {
  renderPagination({ totalPages: 1 });
  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
});

test("shows every page without ellipses when the page count is small", () => {
  renderPagination({ currentPage: 3, totalPages: 5 });
  const pagination = screen.getByRole("navigation");

  expect(within(pagination).queryByText("...")).not.toBeInTheDocument();
  [1, 2, 3, 4, 5].forEach((page) => {
    expect(
      within(pagination).getByRole("button", { name: String(page) })
    ).toBeInTheDocument();
  });
});

test("disables Previous on the first page", () => {
  renderPagination({ currentPage: 1 });
  expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
});

test("disables Next on the last page", () => {
  renderPagination({ currentPage: 10 });
  expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled();
  expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
});

test("calls onPageChange when a page number is clicked", () => {
  const onPageChange = renderPagination({ currentPage: 1 });
  fireEvent.click(screen.getByRole("button", { name: "3" }));
  expect(onPageChange).toHaveBeenCalledWith(3);
});

test("Previous and Next navigate one page at a time", () => {
  const onPageChange = renderPagination({ currentPage: 5 });
  fireEvent.click(screen.getByRole("button", { name: "Previous" }));
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(onPageChange).toHaveBeenNthCalledWith(1, 4);
  expect(onPageChange).toHaveBeenNthCalledWith(2, 6);
});

test("shows ellipses around pages in the middle", () => {
  renderPagination({ currentPage: 5, totalPages: 24 });
  const pagination = screen.getByRole("navigation");
  expect(within(pagination).getAllByText("...")).toHaveLength(2);
  expect(within(pagination).getByRole("button", { name: "1" })).toBeInTheDocument();
  expect(within(pagination).getByRole("button", { name: "4" })).toBeInTheDocument();
  expect(within(pagination).getByRole("button", { name: "5" })).toHaveAttribute("aria-current", "page");
  expect(within(pagination).getByRole("button", { name: "6" })).toBeInTheDocument();
  expect(within(pagination).getByRole("button", { name: "24" })).toBeInTheDocument();
});

test("shows only the right ellipsis near the start", () => {
  renderPagination({ currentPage: 2, totalPages: 24 });
  const pagination = screen.getByRole("navigation");

  expect(within(pagination).getAllByText("...")).toHaveLength(1);
  expect(
    within(pagination).getByRole("button", { name: "24" })
  ).toBeInTheDocument();
});

test("does not duplicate the last page near the end", () => {
  renderPagination({ currentPage: 22, totalPages: 24 });
  const pagination = screen.getByRole("navigation");
  expect(
    within(pagination).getAllByRole("button", { name: "24" })
  ).toHaveLength(1);
  expect(within(pagination).getAllByText("...")).toHaveLength(1);
});
