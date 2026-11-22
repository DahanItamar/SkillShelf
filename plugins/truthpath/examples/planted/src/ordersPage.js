import { fetchOrders } from "./orders.js";

export async function renderOrders(userId) {
  const orders = await fetchOrders(userId);
  if (orders.length === 0) return "You have no orders yet.";
  return orders.map((o) => o.id).join(", ");
}
