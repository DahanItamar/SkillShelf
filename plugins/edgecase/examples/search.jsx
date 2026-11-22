function Search() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!q) { setRows([]); return; }
    setLoading(true); setError("");
    fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: AbortSignal.timeout(10000) })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setRows)
      .catch(() => setError("Search failed. Try again."))
      .finally(() => setLoading(false));
  }, [q]);
  return <><input value={q} onChange={e => setQ(e.target.value)} aria-label="Search" placeholder="Search products" />
    {loading && <p role="status">Searching...</p>}{error && <p role="alert">{error}</p>}
    {!loading && !error && q && rows.length === 0 && <p role="status">No results for "{q}". Try a shorter term.</p>}
    <ul>{rows.map(r => <li key={r.id}>{r.title}</li>)}</ul></>;
}
