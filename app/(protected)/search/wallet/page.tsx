import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TableCaption,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import React from "react";
import { formatPrice } from "@/components/shared/formatPrice";
import FormInvoice from "../../admin/_components/form-invoice";
import ImageDialog from "@/components/shared/Image-dialog";
import CopyButton from "@/components/shared/copy-button";
import Search from "@/components/shared/search";
import SearchPaginationBar from "@/components/shared/search-paginationbar";

const SearchWallet = async ({
  searchParams,
}: {
  searchParams: { query: string; page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const pagesize = 4;
  const query = searchParams.query || "";

  const invoices = await db.money.findMany({
    where: {
      OR: [
        { transactionId: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
      ],
      status: "PENDING",
    },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pagesize,
    take: pagesize,
  });

  const totalItemCount = (
    await db.money.findMany({
      where: {
        OR: [
          { transactionId: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
        ],
        status: "PENDING",
      },
    })
  ).length;
  const totalPages = Math.ceil(totalItemCount / pagesize);

  if (invoices.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Transaction id</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Wallet</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>
              <Search fileName="wallet" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableFooter>
          <TableRow>
            <TableCell className="text-center" colSpan={6}>
              No invoices found
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }

  return (
    <>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Transaction id</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Screenshot</TableHead>
            <TableHead>
              <Search fileName="wallet" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.userId}>
              <TableCell className="font-medium">{invoice.name}</TableCell>
              <TableCell>
                <div className="flex gap-1 items-center">
                  {invoice.transactionId}
                  <CopyButton text={invoice.transactionId} />
                </div>
              </TableCell>
              <TableCell>{formatPrice(Number(invoice.amount))}</TableCell>
              <TableCell>
                <ImageDialog imageLink={invoice.secure_url} />
              </TableCell>
              <TableCell>
                <FormInvoice
                  id={invoice.id.toString()}
                  userId={invoice.userId}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {totalItemCount !== 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-left" colSpan={4}>
                {formatPrice(
                  invoices.reduce((acc, cur) => acc + Number(cur.amount), 0)
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
      {totalPages > 1 && (
        <SearchPaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          searchQuery={query}
        />
      )}
    </>
  );
};

export default SearchWallet;
