const API_BASE = "https://api.example.com/v1";

export async function fetchOrders(userId) {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/orders`);
    return await res.json();
  } catch (err) {
    return [];
  }
}
