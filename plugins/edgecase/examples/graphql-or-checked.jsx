function Cart() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch("/api/cart", { signal: AbortSignal.timeout(8000) })
      .then(r => {
        if (!r.ok) throw new Error("failed");
        return r.json();
      })
      .then(setItems)
      .catch(e => setError(e));
  }, []);
  if (items === null) return <p>Loading cart...</p>;
  if (items.length === 0) return <p>Your cart is empty.</p>;
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}
