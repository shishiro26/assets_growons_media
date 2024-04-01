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
import ImageDialog from "@/components/shared/Image-dialog";
import PaginationBar from "../../../money/_components/PaginationBar";
import TopBar from "../../../_components/Topbar";
import ReasonDialog from "@/components/shared/ReasonDialog";
import BadgeStatus from "@/app/(protected)/money/_components/BadgeStatus";
import Search from "@/components/shared/search";

export const generateMetadata = () => {
  return {
    title: "Admin Wallet | GrowonsMedia",
    description: "Admin Wallet",
  };
};

const AdminWallet = async ({
  searchParams,
}: {
  searchParams: { page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 10;
  const totalItemCount = await db.money.count();

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const invoices = await db.money.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });
  return (
    <section className="my-2">
      <nav className="hidden md:block">
        <TopBar title="Admin Wallet" />
      </nav>
      <div className="p-1 m-1 w-[50%]">
        <Search fileName="wallet-history" />
      </div>
      <section className="space-y-4 md:overflow-auto md:max-h-[75vh] w-full md:w-[100%] p-2">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
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
          {totalItemCount !== 0 && (
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
