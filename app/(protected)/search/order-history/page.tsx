import Search from "@/components/shared/search";
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
import PaginationBar from "../../money/_components/PaginationBar";
import ReasonDialog from "@/components/shared/ReasonDialog";
import BadgeStatus from "@/app/(protected)/money/_components/BadgeStatus";
import FileDialog from "../../admin/_components/file-dialog";
import GetName from "../../admin/orders/_components/get-name";
import { formatPrice } from "@/components/shared/formatPrice";
import ViewAssets from "@/app/(protected)/_components/view-assets";

const SearchOrderHistory = async ({
  searchParams,
}: {
  searchParams: { page: string; query: string };
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
      },
      include: {
        User: true,
      },
    })
  ).length;

  const totalPages = Math.ceil(totalItemCount / pagesize);

  const orders = await db.order.findMany({
    where: {
      OR: [
        {
          name: { mode: "insensitive", contains: query },
          orderId: { mode: "insensitive", contains: query },
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
            <TableHead>OrderId</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Created on</TableHead>
          </TableRow>
        </TableHeader>
        <TableFooter>
          <TableRow>
            <TableCell className="text-center" colSpan={8}>
              No invoices found
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={6}>
              <Search fileName="order-history" />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }
  return (
    <section>
      <Search fileName="order-history" />
      <div className="ml-2 mt-4 space-y-4 md:overflow-auto md:max-h-[90vh] w-full md:w-[100%] p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>OrderId</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Created on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <GetName userId={order.userId} />
                  </TableCell>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>
                    {order.status === "FAILED" && order.reason !== null ? (
                      <ReasonDialog
                        status={order.status}
                        reason={order.reason}
                      />
                    ) : (
                      order.status === "SUCCESS" && (
                        <>
                          <FileDialog
                            status={order.status}
                            files={JSON.parse(JSON.stringify(order.files))}
                          />
                        </>
                      )
                    )}
                    {order.status !== "FAILED" &&
                      order.status !== "SUCCESS" && (
                        <BadgeStatus status={order.status} />
                      )}
                  </TableCell>
                  <TableCell>
                    <ViewAssets
                      assets={JSON.parse(JSON.stringify(order.assets))}
                    />
                  </TableCell>
                  <TableCell>{formatPrice(order.amount)}</TableCell>
                  <TableCell className="flex flex-col">
                    <span>{order.createdAt.toDateString()}</span>
                    <span>
                      {order.createdAt.toLocaleTimeString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        hour12: false,
                        timeZoneName: "shortGeneric",
                      })}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          {totalItemCount !== 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total</TableCell>
                <TableCell className="text-left" colSpan={4}>
                  {formatPrice(
                    orders.reduce((acc, cur) => acc + Number(cur.amount), 0)
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
};

export default SearchOrderHistory;
