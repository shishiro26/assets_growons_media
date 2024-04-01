import React from "react";
import { db } from "@/lib/db";
import FeedbackForm from "@/app/(protected)/_components/feedback-form";
import TopBar from "@/app/(protected)/_components/Topbar";
import ReplyForm from "./_components/ReplyForm";
export const generateMetadata = () => {
  return {
    title: "Feedback | GrowonsMedia",
    description: "Feedback in the grownonsMedia",
  };
};

const FeedbackPage = async ({ params }: { params: { id: string } }) => {
  const orderFeedback = await db.feedback.findUnique({
    where: {
      orderId: params.id,
    },
  });

  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Add Reply" />
      </div>
      <section>
        <div className="m-3">
          <div className="mt-4">
            <ReplyForm
              feedback={orderFeedback?.feedback ?? ""}
              orderId={params.id}
              secure_url={orderFeedback?.secure_url ?? ""}
              fileName={orderFeedback?.fileName ?? ""}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default FeedbackPage;
