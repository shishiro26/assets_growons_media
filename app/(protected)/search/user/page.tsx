import { formatPrice } from "@/components/shared/formatPrice";
import Search from "@/components/shared/search";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { Metadata } from "next";
import DownloadToExcel from "../../admin/analytics/_components/download-to-excel";
import DateRangeFilter from "../../admin/analytics/_components/date-range-filter";
import SearchPaginationBar from "@/components/shared/search-paginationbar";

interface SearchPageProps {
  searchParams: { query: string; page: string; startDate: Date; endDate: Date };
}

export function generateMetadata({
  searchParams: { query },
}: SearchPageProps): Metadata {
  return {
    title: `Search: ${query} - Growonsmedia`,
  };
}

export default async function SearchUserPage({
  searchParams: { query, page, startDate, endDate },
}: SearchPageProps) {
  const currentPage = parseInt(page) || 1;
  const pageSize = 9;
  const startedDate = startDate || new Date("1983-01-01");
  const endedDate = endDate || new Date();

  const totalItemCount = (
    await db.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { number: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { id: "desc" },
      include: {
        Order: {
          select: {
            amount: true,
          },
        },
        money: {
          select: {
            amount: true,
          },
        },
      },
    })
  ).length;
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const users = await db.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { number: { contains: query, mode: "insensitive" } },
      ],
      createdAt: {
        lte: endedDate,
        gte: startedDate,
      },
    },
    orderBy: { id: "desc" },
    include: {
      Order: {
        select: {
          amount: true,
        },
      },
      money: {
        select: {
          amount: true,
        },
      },
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  if (users.length === 0) {
    return (
      <section className="m-2">
        <div className="flex items-center justify-between gap-x-2">
          <Search fileName="user" />
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
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
    );
  }

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
      </Table>
      {totalPages > 1 && (
        <SearchPaginationBar
          totalPages={totalPages}
          currentPage={currentPage}
          searchQuery={query}
        />
      )}
    </section>
  );
}
