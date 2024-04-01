import { formatPrice } from "@/components/shared/formatPrice";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import PaginationBar from "../../../money/_components/PaginationBar";
import TopBar from "../../../_components/Topbar";
import ReasonDialog from "@/components/shared/ReasonDialog";
import BadgeStatus from "@/app/(protected)/money/_components/BadgeStatus";
import FileDialog from "../../_components/file-dialog";
import GetName from "../_components/get-name";
import Search from "@/components/shared/search";
import ViewAssets from "@/app/(protected)/_components/view-assets";

export const generateMetadata = () => {
  return {
    title: "Admin Orders History | GrowonsMedia",
    description: "Admin Wallet",
  };
};

type AdminHistoryProps = {
  searchParams: { page: string };
};

const AdminWallet = async ({ searchParams }: AdminHistoryProps) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 12;
  const totalItemCount = await db.order.count();

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const Orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });
  return (
    <section className="my-2">
      <nav className="hidden md:block">
        <TopBar title="Admin Wallet" />
      </nav>
      <div className="m-1 p-1">
        <Search fileName="order-history" />
      </div>
      <section className="space-y-4 md:overflow-auto md:max-h-[75vh] w-full md:w-[100%]">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
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
          {totalItemCount === 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No orders found
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
          <TableBody>
            {Orders?.map((order, index) => {
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
                    Orders.reduce((acc, cur) => acc + Number(cur.amount), 0)
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </section>

      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
};

export default AdminWallet;
