function Projects({ projects, onChange }) {
  const [error, setError] = useState("");
  async function archive(p) {
    try {
      const r = await fetch(`/api/projects/${p.id}/archive`, { method: "POST", signal: AbortSignal.timeout(10000) });
      if (!r.ok) throw new Error();
      onChange({ ...p, archived: true });
    } catch {
      setError(`Could not archive ${p.name}. Try again.`);
    }
  }
  if (projects.length === 0) return <p>No projects yet. Create one to get started.</p>;
  return <>{error && <p role="alert">{error}</p>}<ul>{projects.map(p => <li key={p.id}>{p.name}
    <button onClick={() => archive(p)}>Archive</button></li>)}</ul></>;
}
