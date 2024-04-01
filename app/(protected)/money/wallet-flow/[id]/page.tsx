import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import React from "react";
import PaginationBar from "../../_components/PaginationBar";
import { formatPrice } from "@/components/shared/formatPrice";
import TopBar from "@/app/(protected)/_components/Topbar";

const WalletFlow = async ({
  searchParams,
  params,
}: {
  searchParams: { page: string; id: string };
  params: { id: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 15;
  const totalItemCount = (
    await db.walletFlow.findMany({
      where: {
        userId: params.id,
      },
    })
  ).length;

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const walletFlow = await db.walletFlow.findMany({
    where: { userId: params.id },
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
    orderBy: { createdAt: "desc" },
  });

  if (totalItemCount === 0) {
    return (
      <section>
        <div className="hidden md:block">
          <TopBar title="Wallet flow" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Transaction/Order-ID</TableHead>
              <TableHead>Money</TableHead>
              <TableHead>Date created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No records found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    );
  }
  return (
    <section>
      <div className="hidden md:block">
        <TopBar title="Wallet flow" />
      </div>
      <div className="space-y-4 md:overflow-auto md:max-h-[85vh] w-full md:w-[100%] p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Transaction/Order-id</TableHead>
              <TableHead>Money</TableHead>
              <TableHead>Date created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {walletFlow.map((flow) => {
              return (
                <TableRow key={flow.id}>
                  <TableCell>{flow.purpose}</TableCell>
                  <TableCell>
                    {flow.purpose === "ADMIN" ? <>-</> : flow.moneyId}
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {
                      <>
                        {flow.purpose === "ADMIN" ? (
                          <span>{formatPrice(flow.amount)}</span>
                        ) : (
                          <span>
                            {flow.purpose?.toLowerCase() === "wallet recharge"
                              ? `+${formatPrice(Math.abs(flow.amount))}`
                              : `-${formatPrice(Math.abs(flow.amount))}`}
                          </span>
                        )}
                      </>
                    }
                  </TableCell>
                  <TableCell>{flow.createdAt.toDateString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
};

export default WalletFlow;
