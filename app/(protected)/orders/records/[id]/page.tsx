import TopBar from "@/app/(protected)/_components/Topbar";
import ViewAssets from "@/app/(protected)/_components/view-assets";
import FileDialog from "@/app/(protected)/admin/_components/file-dialog";
import BadgeStatus from "@/app/(protected)/money/_components/BadgeStatus";
import PaginationBar from "@/app/(protected)/money/_components/PaginationBar";
import ReasonDialog from "@/components/shared/ReasonDialog";
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

export const generateMetadata = () => {
  return {
    title: "Client Order Records | GrowonsMedia",
    description: "Client order Records",
  };
};
const ClientRecords = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 10;

  const totalItemCount = await db.order.count();

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const Orders = await db.order.findMany({
    where: { userId: params.id },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Order Records" />
      </div>
      <div className="space-y-4 md:overflow-auto md:max-h-[84vh] w-full md:w-[100%] p-2">
        <Table className="my-2">
          {totalItemCount === 0 && (
            <TableCaption>A list of your recent Orders.</TableCaption>
          )}
          <TableHeader>
            <TableRow>
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
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>
                    {order.status === "FAILED" && order.reason !== null ? (
                      <ReasonDialog
                        status={order.status}
                        reason={order.reason}
                      />
                    ) : (
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
                  <TableCell>
                    {order.status === "SUCCESS" && (
                      <FileDialog
                        status={order.status}
                        files={JSON.parse(JSON.stringify(order.files))}
                      />
                    )}
                  </TableCell>
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
                    Orders?.reduce((acc, order) => acc + order.amount, 0) ?? 0
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
    </>
  );
};

export default ClientRecords;
