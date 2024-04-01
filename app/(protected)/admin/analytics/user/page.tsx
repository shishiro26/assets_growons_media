import { formatPrice } from "@/components/shared/formatPrice";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import React from "react";
import DownloadToExcel from "../_components/download-to-excel";
import { revalidatePath } from "next/cache";
import PaginationBar from "@/app/(protected)/money/_components/PaginationBar";
import DateRangeFilter from "../_components/date-range-filter";
import Search from "@/components/shared/search";

const UserAnalytics = async ({
  searchParams,
}: {
  searchParams: { page: string; startDate: Date; endDate: Date };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const pageSize = 9;
  const startDate = searchParams.startDate || new Date("1983-01-01");
  const endDate = searchParams.endDate || new Date();

  const totalItemCount = await db.user.count();
  const totalPages = Math.ceil(totalItemCount / pageSize);
  const users = await db.user.findMany({
    where: {
      createdAt: {
        lte: endDate,
        gte: startDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      money: {
        select: {
          amount: true,
        },
      },
      Order: {
        select: {
          amount: true,
        },
      },
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  revalidatePath("/admin/analytics/user");
  return (
    <section className="m-2">
      <div className="flex items-center justify-between gap-x-2 p-1 md:hidden">
        <DownloadToExcel data={users} fileName="Users" />
        <Search fileName="user" />
      </div>
      <div className="md:flex md:items-center md:justify-between md:gap-x-2">
        <div className="hidden md:flex items-center justify-between  gap-x-3">
          <DownloadToExcel data={users} fileName="Users" />
          <Search fileName="user" />
        </div>
        <div className="mt-1 flex items-center justify-around gap-x-2 w-fit">
          <DateRangeFilter />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UserName</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Date of Joining</TableHead>
            <TableHead>Total order</TableHead>
            <TableHead>Total money</TableHead>
            <TableHead>Wallet</TableHead>
          </TableRow>
        </TableHeader>
        {totalItemCount === 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        <TableBody>
          {users.map((user) => {
            const totalOrders = user.Order.reduce((sum, order) => {
              return sum + order.amount;
            }, 0);
            return (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.number}</TableCell>
                <TableCell>{user.createdAt.toDateString()}</TableCell>
                <TableCell>{formatPrice(totalOrders) || 0}</TableCell>
                <TableCell>
                  {formatPrice(
                    user.money.reduce(
                      (sum, money) => sum + Number(money.amount),
                      0
                    )
                  )}
                </TableCell>
                <TableCell>{formatPrice(user.totalMoney)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        {totalItemCount !== 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell>
                {formatPrice(
                  users.reduce(
                    (acc, cur) =>
                      acc +
                      cur.Order.reduce((sum, order) => sum + order.amount, 0),
                    0
                  )
                )}
              </TableCell>
              <TableCell className="text-left" colSpan={3}>
                {formatPrice(
                  users.reduce((acc, cur) => acc + Number(cur.totalMoney), 0)
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
};

export default UserAnalytics;
