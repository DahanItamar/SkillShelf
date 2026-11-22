export async function syncCart(cart, api) {
  api.post("/cart", cart).catch(() => {});
  return true;
}
