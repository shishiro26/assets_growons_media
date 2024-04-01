import { db } from "@/lib/db";
import UpdateMoneyForm from "./_components/update-money";

const UpdateMoney = async ({ params }: { params: { id: string } }) => {
  const user = await db.user.findUnique({
    where: {
      id: params.id,
    },
  });
  if (!user) {
    return <div>User not found</div>;
  }
  return (
    <section className="p-2 m-2">
      <h1 className="text-3xl my-3">Update wallet</h1>
      <UpdateMoneyForm userId={user?.id} amount={user?.totalMoney} />
    </section>
  );
};

export default UpdateMoney;
