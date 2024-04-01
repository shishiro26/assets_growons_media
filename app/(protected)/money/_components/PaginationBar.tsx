import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

type PaginationBarProps = {
  currentPage: number;
  totalPages: number;
};

const PaginationBar = ({ currentPage, totalPages }: PaginationBarProps) => {
  const maxPage = Math.min(totalPages, Math.max(currentPage + 4, 10));
  const minPage = Math.max(1, Math.min(currentPage - 5, maxPage - 9));

  const numberedPageItems: JSX.Element[] = [];

  for (let page = minPage; page <= maxPage; page++) {
    numberedPageItems.push(
      <PaginationItem key={page}>
        <PaginationLink href={"?page=" + page}>{page}</PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <Pagination className="mt-1">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={"?page=" + (currentPage - 1)} />
          </PaginationItem>
        )}
        {numberedPageItems}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={"?page=" + (currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationBar;
