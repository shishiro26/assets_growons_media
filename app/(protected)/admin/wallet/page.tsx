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
import FormInvoice from "../_components/form-invoice";
import ImageDialog from "@/components/shared/Image-dialog";
import PaginationBar from "../../money/_components/PaginationBar";
import CopyButton from "@/components/shared/copy-button";
import TopBar from "../../_components/Topbar";
import Search from "@/components/shared/search";

export const generateMetadata = () => {
  return {
    title: "Admin Wallet | GrowonsMedia",
    description: "Admin Wallet",
  };
};

type AdminWalletParams = {
  searchParams: { page: string };
};

const AdminWallet = async ({ searchParams }: AdminWalletParams) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 7;
  const totalItemCount = (
    await db.money.findMany({
      where: { status: "PENDING" },
    })
  ).length;

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const invoices = await db.money.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });
  return (
    <section className="my-2">
      <nav className="hidden md:block">
        <TopBar title="Admin Wallet" />
      </nav>
      <div className="ml-2 mt-4 space-y-4 md:overflow-auto md:max-h-[85vh] w-full md:w-[100%] p-2">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Transaction id</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Screenshot</TableHead>
              <TableHead>
                <Search fileName="wallet" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.userId}>
                <TableCell className="font-medium">{invoice.name}</TableCell>
                <TableCell>
                  <div className="flex gap-1 items-center">
                    {invoice.transactionId}
                    <span className="hidden md:block">
                      <CopyButton text={invoice.transactionId} />
                    </span>
                  </div>
                </TableCell>
                <TableCell>{formatPrice(Number(invoice.amount))}</TableCell>
                <TableCell>
                  <ImageDialog imageLink={invoice.secure_url} />
                </TableCell>
                <TableCell>
                  <FormInvoice
                    id={invoice.id.toString()}
                    userId={invoice.userId}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {totalItemCount !== 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-left" colSpan={4}>
                  {formatPrice(
                    invoices.reduce((acc, cur) => acc + Number(cur.amount), 0)
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

export default AdminWallet;
