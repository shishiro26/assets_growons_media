import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import Search from "@/components/shared/search";
import { db } from "@/lib/db";
import BalanceCell from "../../admin/_components/Balance-cell";
import EditUser from "../../admin/user/_components/edit-user";
import ProUser from "../../admin/_components/upgrade-to-pro";
import SearchPaginationBar from "@/components/shared/search-paginationbar";

const SearchUserManagement = async ({
  searchParams,
}: {
  searchParams: { query: string; page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const pageSize = 7;

  const users = await db.user.findMany({
    where: {
      OR: [
        { name: { contains: searchParams.query, mode: "insensitive" } },
        { email: { contains: searchParams.query, mode: "insensitive" } },
        { number: { contains: searchParams.query, mode: "insensitive" } },
      ],
    },
    orderBy: { id: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const totalItemCount = (
    await db.user.findMany({
      where: {
        OR: [
          { name: { contains: searchParams.query, mode: "insensitive" } },
          { email: { contains: searchParams.query, mode: "insensitive" } },
          { number: { contains: searchParams.query, mode: "insensitive" } },
        ],
      },
    })
  ).length;
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const assets = await db.asset.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (users.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UserName</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Wallet</TableHead>
            <TableHead>Joined on</TableHead>
            <TableHead colSpan={2}>
              <Search fileName={"user-management"} />
            </TableHead>
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
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UserName</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Wallet</TableHead>
            <TableHead>Joined on</TableHead>
            <TableHead colSpan={2}>
              <Search fileName={"user-management"} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className={user.role === "BLOCKED" ? "text-red-500" : ""}
            >
              <TableCell className="capitalize">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <BalanceCell id={user.id} />
              </TableCell>
              <TableCell>{user.createdAt.toDateString()}</TableCell>
              <TableCell>
                <EditUser user={user} />
              </TableCell>
              {user.role !== "BLOCKED" && (
                <TableCell>
                  <ProUser
                    userId={user.id}
                    role={user.role}
                    assets={assets}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <SearchPaginationBar
          totalPages={totalPages}
          currentPage={currentPage}
          searchQuery={searchParams.query}
        />
      )}
    </>
  );
};

export default SearchUserManagement;
