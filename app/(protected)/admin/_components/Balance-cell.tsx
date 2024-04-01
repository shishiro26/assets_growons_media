import { formatPrice } from "@/components/shared/formatPrice";
import { getUserById } from "@/data/user";

const BalanceCell = async ({ id }: { id: string }) => {
  const remainingBalance = await getUserById(id);
  return formatPrice(remainingBalance?.totalMoney ?? 0);
};

export default BalanceCell;
