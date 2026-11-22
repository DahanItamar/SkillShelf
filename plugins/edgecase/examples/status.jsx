function Notes({ note, onSaved }) {
  const [text, setText] = useState(note.text);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  async function save() {
    setSaving(true); setMessage("");
    try {
      await fetch(`/api/notes/${note.id}`, { method: "PUT", body: JSON.stringify({ text }), signal: AbortSignal.timeout(10000) });
      onSaved(text);
      setMessage("Saved.");
    } catch {
      setMessage("Could not save the note. Check your connection and try again.");
    } finally { setSaving(false); }
  }
  return <><textarea value={text} onChange={e => setText(e.target.value)} />
    <button disabled={saving} onClick={save}>{saving ? "Saving..." : "Save"}</button>
    <p role="status">{message}</p></>;
}
