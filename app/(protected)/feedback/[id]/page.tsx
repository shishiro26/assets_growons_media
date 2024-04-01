import React from "react";
import { db } from "@/lib/db";
import FeedbackForm from "../../_components/feedback-form";
import TopBar from "../../_components/Topbar";

export const generateMetadata = () => {
  return {
    title: "Feedback | GrowonsMedia",
    description: "Feedback in the grownonsMedia",
  };
};

const FeedbackPage = async ({ params }: { params: { id: string } }) => {
  const orders = await db.order.findMany({
    where: { userId: params.id },
    include: {
      User: { select: { name: true } },
    },
  });

  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Add Feedback" />
      </div>
      <section>
        <div className="m-3">
          <div className="mt-4">
            <FeedbackForm orders={orders} userId={params.id} />
          </div>
        </div>
      </section>
    </>
  );
};

export default FeedbackPage;
