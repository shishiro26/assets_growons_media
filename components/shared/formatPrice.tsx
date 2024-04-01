export function formatPrice(price: number) {
  return price.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
}
