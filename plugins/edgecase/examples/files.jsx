function Files({ files, onRemoved, toast }) {
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  async function remove(f) {
    setBusy(f.id);
    try {
      const r = await fetch(`/api/files/${f.id}`, { method: "DELETE", signal: AbortSignal.timeout(10000) });
      if (r.status === 401) { setError("Your session expired. Sign in again to delete files."); return; }
      if (!r.ok) { setError(`Could not delete ${f.name}. Try again.`); return; }
      onRemoved(f.id);
      toast("File deleted. Undo", { timeout: 3000 });
    } catch {
      setError(`Could not delete ${f.name}: the server did not respond. Try again.`);
    } finally { setBusy(null); }
  }
  if (files.length === 0) return <p>No files yet. Uploaded files appear here.</p>;
  return <>{error && <p role="alert">{error}</p>}<ul>{files.map(f => <li key={f.id}>{f.name}
    <button disabled={busy === f.id} onClick={() => remove(f)}>{busy === f.id ? "Deleting..." : "Delete"}</button></li>)}</ul></>;
}
