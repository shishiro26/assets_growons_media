import { formatPrice } from "@/components/shared/formatPrice";
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
import PaginationBar from "../../../money/_components/PaginationBar";
import Search from "@/components/shared/search";
import DateRangeFilter from "../_components/date-range-filter";
import WalletToExcel from "./_components/wallet-to-excel";

export const generateMetadata = () => {
  return {
    title: "Top up history | GrowonsMedia",
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
      <div className="flex items-center justify-between gap-x-2 p-1 md:hidden">
        <WalletToExcel
          data={JSON.parse(JSON.stringify(invoices))}
          fileName="Users"
        />
        <Search fileName="user" />
      </div>
      <div className="md:flex md:items-center md:justify-between md:gap-x-2">
        <div className="hidden md:flex items-center justify-between  gap-x-3">
          <WalletToExcel
            data={JSON.parse(JSON.stringify(invoices))}
            fileName="Users"
          />
          <Search fileName="wallet-history" />
        </div>
        <div className="mt-1 flex items-center justify-around gap-x-2 w-fit">
          <DateRangeFilter />
        </div>
      </div>
      <section className="space-y-4 md:overflow-auto md:max-h-[84vh] w-full md:w-[100%] p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Account No</TableHead>
              <TableHead>UPI-ID</TableHead>
              <TableHead>Transaction id</TableHead>
              <TableHead>Charge Money</TableHead>
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
