import Search from "@/components/shared/search";
import {
  Table,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import React from "react";
import BalanceCell from "../../admin/_components/Balance-cell";
import { formatPrice } from "@/components/shared/formatPrice";
import AdminOrderForm from "../../admin/_components/admin-order-form";
import SearchPaginationBar from "@/components/shared/search-paginationbar";

const SearchOrder = async ({
  searchParams,
}: {
  searchParams: { query: string; page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const pagesize = 4;
  const query = searchParams.query || "";

  const totalItemCount = (
    await db.order.findMany({
      where: {
        OR: [
          {
            name: { mode: "insensitive", contains: query },
          },
        ],
        status: "PENDING",
      },
      include: {
        User: true,
      },
    })
  ).length;

  const totalPages = Math.ceil(totalItemCount / pagesize);

  const orders = await db.order.findMany({
    where: {
      status: "PENDING",
      OR: [
        {
          name: { mode: "insensitive", contains: query },
        },
      ],
    },
    include: {
      User: {
        select: {
          name: true,
          email: true,
          number: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * pagesize,
    take: pagesize,
  });

  if (orders.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Assets</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>
              <Search fileName="order" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableFooter>
          <TableRow>
            <TableCell className="text-center" colSpan={6}>
              No orders found
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }

  return (
    <>
      <section className="md:overflow-auto md:max-h-[85vh] w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Assets</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>
                <Search fileName="order" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const assets = order.assets;
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.name}</TableCell>
                  <TableCell>
                    {Array.isArray(assets) &&
                      assets.map((asset: any, index: number) => (
                        <div key={index}>
                          <span>{asset.name}</span>{" "}
                          <span> - Quantity: {asset.quantity}</span>
                        </div>
                      ))}
                  </TableCell>
                  <TableCell>
                    <BalanceCell id={order.userId} />
                  </TableCell>
                  <TableCell>{formatPrice(order.amount)}</TableCell>
                  <TableCell>
                    <AdminOrderForm
                      userId={order.userId}
                      id={order.id}
                      amount={order.amount}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell>
                {formatPrice(
                  orders?.reduce((acc, order) => acc + order.amount, 0) ?? 0
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
      {totalPages > 1 && (
        <SearchPaginationBar
          totalPages={totalPages}
          currentPage={currentPage}
          searchQuery={query}
        />
      )}
    </>
  );
};

export default SearchOrder;
