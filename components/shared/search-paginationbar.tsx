import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

type SearchPaginationBarProps = {
  currentPage: number;
  totalPages: number;
  searchQuery: string;
};

const SearchPaginationBar = ({
  currentPage,
  totalPages,
  searchQuery,
}: SearchPaginationBarProps) => {
  const maxPage = Math.min(totalPages, Math.max(currentPage + 4, 10));
  const minPage = Math.max(1, Math.min(currentPage - 5, maxPage - 9));

  const numberedPageItems: JSX.Element[] = [];

  for (let page = minPage; page <= maxPage; page++) {
    numberedPageItems.push(
      <PaginationItem key={page}>
        <PaginationLink href={`?query=${searchQuery}&page=${page}`}>
          {page}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <Pagination className="mt-1">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={`?query=${searchQuery}&page=${currentPage - 1}`}
            />
          </PaginationItem>
        )}
        {numberedPageItems}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={`?query=${searchQuery}&page=${currentPage + 1}`}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default SearchPaginationBar;
