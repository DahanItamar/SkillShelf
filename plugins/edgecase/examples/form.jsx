function Invite() {
  const [email, setEmail] = useState("");
  const valid = /.+@.+/.test(email);
  function send(e) {
    e.preventDefault();
    fetch("/api/invite", { method: "POST", body: email }).catch(() => {});
  }
  return (
    <form onSubmit={send}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button disabled={!valid}>Send invite</button>
    </form>
  );
}
