function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch("/api/orders").then(r => r.json()).then(setOrders).catch(() => {});
  }, []);
  return <ul>{orders.map(o => <li key={o.id}>{o.name}</li>)}</ul>;
}
