import React from "react";
import { formatPrice } from "@/components/shared/formatPrice";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ImageDialog from "@/components/shared/Image-dialog";
import ReasonDialog from "@/components/shared/ReasonDialog";
import BadgeStatus from "@/app/(protected)/money/_components/BadgeStatus";
import Search from "@/components/shared/search";
import { db } from "@/lib/db";
import SearchPaginationBar from "@/components/shared/search-paginationbar";

const SearchHistoryWallet = async ({
  searchParams,
}: {
  searchParams: { query: string; page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const pageSize = 7;
  const query = searchParams.query || "";

  const invoices = await db.money.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { transactionId: { contains: query, mode: "insensitive" } },
        { upiid: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
        { accountNumber: { contains: query, mode: "insensitive" } },
        {},
      ],
    },
    orderBy: { id: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const totalItemCount = (
    await db.money.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { transactionId: { contains: query, mode: "insensitive" } },
          { upiid: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
          { accountNumber: { contains: query, mode: "insensitive" } },
        ],
      },
    })
  ).length;
  const totalPages = Math.ceil(totalItemCount / pageSize);

  if (invoices.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Account No</TableHead>
            <TableHead>UPI-ID</TableHead>
            <TableHead>Transaction id</TableHead>
            <TableHead>Charge Money</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Screenshot</TableHead>
            <TableHead>Date Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableFooter>
          <TableRow>
            <TableCell className="text-center" colSpan={8}>
              No invoices found
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={8}>
              <Search fileName="wallet-history" />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }

  return (
    <section>
      <div className="m-1 p-1 w-[50%]">
        <Search fileName="wallet-history" />
      </div>
      <div className="ml-2 mt-4 space-y-4 md:overflow-auto md:max-h-[80vh] w-full md:w-[100%] p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Account No</TableHead>
              <TableHead>UPI-ID</TableHead>
              <TableHead>Transaction id</TableHead>
              <TableHead>Charge Money</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Screenshot</TableHead>
              <TableHead>Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.upiid}>
                <TableCell>{invoice.name}</TableCell>
                <TableCell>{invoice.accountNumber}</TableCell>
                <TableCell>{invoice.upiid}</TableCell>
                <TableCell>{invoice.transactionId}</TableCell>
                <TableCell>{formatPrice(Number(invoice.amount))}</TableCell>
                <TableCell className="cursor-pointer">
                  {invoice.status === "FAILED" && invoice.reason !== null ? (
                    <ReasonDialog
                      status={invoice.status}
                      reason={invoice.reason}
                    />
                  ) : (
                    <BadgeStatus status={invoice.status} />
                  )}
                </TableCell>
                <TableCell>
                  <ImageDialog imageLink={invoice.secure_url} />
                </TableCell>
                <TableCell>{invoice.createdAt.toDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="text-left" colSpan={4}>
                {formatPrice(
                  invoices.reduce((acc, cur) => acc + Number(cur.amount), 0)
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      {totalPages > 1 && (
        <SearchPaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          searchQuery={query}
        />
      )}
    </section>
  );
};

export default SearchHistoryWallet;
