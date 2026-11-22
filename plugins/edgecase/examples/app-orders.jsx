// Next.js App Router: app/orders/page.jsx
import { Suspense } from "react";
import { revalidatePath } from "next/cache";

async function OrderList() {
  const res = await fetch(`${process.env.API}/orders`, { cache: "no-store" });
  const orders = await res.json();
  if (orders.length === 0) return <p>No orders yet. They appear here after checkout.</p>;
  return <ul>{orders.map(o => <li key={o.id}>{o.ref}</li>)}</ul>;
}

async function Recommendations() {
  const res = await fetch(`${process.env.API}/recommendations`, { next: { revalidate: 60 } });
  const items = await res.json();
  if (!items.length) return null;
  return <ul>{items.map(i => <li key={i.id}>{i.title}</li>)}</ul>;
}

async function cancelAll() {
  "use server";
  await fetch(`${process.env.API}/orders/cancel-all`, { method: "POST" });
  revalidatePath("/orders");
}

export default function Page() {
  return (
    <main>
      <h1>Orders</h1>
      <Suspense fallback={<p>Loading orders...</p>}><OrderList /></Suspense>
      <Suspense fallback={<p>Loading suggestions...</p>}><Recommendations /></Suspense>
      <form action={cancelAll}><button type="submit">Cancel all orders</button></form>
    </main>
  );
}
