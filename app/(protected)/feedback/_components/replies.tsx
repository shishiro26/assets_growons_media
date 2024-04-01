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
import { formatPrice } from "@/components/shared/formatPrice";
import ImageDialog from "@/components/shared/Image-dialog";
import ReasonDialog from "@/components/shared/ReasonDialog";
import { revalidatePath } from "next/cache";
import FileDialog from "../../admin/_components/file-dialog";
import FeedbackDialog from "./FeedbackDialog";
import Link from "next/link";
import ReplyDialog from "./ReplyDialog";

type TableProps = {
  searchParams: { page: string };
  userId: string;
};

export async function Replies({ userId, searchParams }: TableProps) {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 5;
  const totalItemCount = (
    await db.feedback.findMany({
      where: { userId: userId },
    })
  ).length;

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const feedbacks = await db.feedback.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  revalidatePath(`/money/record/${userId}`);

  return (
    <section className="w-full">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Order Id</TableHead>
            <TableHead>Feedback</TableHead>
            <TableHead>File</TableHead>
            <TableHead>Reply</TableHead>
            <TableHead>Reply File</TableHead>
            <TableHead>updated at</TableHead>
          </TableRow>
        </TableHeader>
        {totalItemCount === 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No Feedbacks found
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        <TableBody>
          {feedbacks.map((feedback) => (
            <TableRow key={feedback.id}>
              <TableCell>{feedback.orderId}</TableCell>
              <TableCell>
                {feedback.feedback.includes("https") ? (
                  <Link
                    href={feedback.feedback}
                    target="_blank"
                    className="text-[#3b49df] underline"
                  >
                    Link
                  </Link>
                ) : (
                  <>{feedback.feedback}</>
                )}
              </TableCell>
              <TableCell>
                {feedback.secure_url && (
                  <FeedbackDialog
                    head="Feedback"
                    fileName={feedback.fileName as string}
                    secure_url={feedback.secure_url as string}
                    public_id={(feedback.public_id as string) ?? ""}
                  />
                )}
              </TableCell>
              <TableCell>
                {feedback.reply && <ReplyDialog reply={feedback.reply} />}
              </TableCell>
              <TableCell>
                {feedback.reply_secure_url && (
                  <FeedbackDialog
                    head={"Reply"}
                    fileName={feedback.reply_fileName as string}
                    secure_url={feedback.reply_secure_url as string}
                    public_id={(feedback.reply_public_id as string) ?? ""}
                  />
                )}
              </TableCell>
              <TableCell>{feedback.updatedAt.toDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
}
