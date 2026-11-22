import { fetchOrders } from "../src/orders.js";

globalThis.fetch = async () => { throw new Error("down"); };
try { await fetchOrders("u1"); } catch {}
