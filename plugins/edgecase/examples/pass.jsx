function Orders() {
  const [state, setState] = useState({ status: "loading" });
  const load = useCallback(() => {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 10000);
    setState({ status: "loading" });
    fetch("/api/orders", { signal: ctl.signal })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then(data => setState({ status: "ok", data }))
      .catch(() => setState({ status: "error" }))
      .finally(() => clearTimeout(t));
  }, []);
  useEffect(load, [load]);
  if (state.status === "loading") return <p role="status">Loading orders...</p>;
  if (state.status === "error")
    return <div role="alert"><p>Could not load your orders. Check your connection.</p><button onClick={load}>Try again</button></div>;
  if (state.data.length === 0) return <p>No orders yet. Orders you place appear here.</p>;
  return <ul>{state.data.map(o => <li key={o.id}>{o.name}</li>)}</ul>;
}
