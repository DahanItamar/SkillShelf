// api: an axios instance with a 10 second timeout (lib/api.js); it throws on any non-2xx response
function Overview({ accountId }) {
  const orders = useQuery(["orders", accountId], () => api.get(`/orders?account=${accountId}`));
  const usage = useQuery(["usage", accountId], () => api.get(`/usage?account=${accountId}`));
  const team = useQuery(["team", accountId], () => api.get(`/team?account=${accountId}`));
  const [inviteEmail, setInviteEmail] = useState("");
  const [sent, setSent] = useState(false);
  async function invite() {
    try {
      await api.post(`/team/invite`, { email: inviteEmail });
      setSent(true);
    } catch (e) {
      setSent(false);
    }
  }
  return (
    <main>
      <h1>Overview</h1>
      <section>
        <h2>Orders</h2>
        {orders.isLoading ? <Skeleton rows={5} /> : orders.isError ? <p role="alert">Orders could not be loaded. <button onClick={() => orders.refetch()}>Retry</button></p> :
          orders.data.length === 0 ? <p>No orders yet. Create one from the Catalog.</p> :
          <ul>{orders.data.map(o => <li key={o.id}>{o.ref}</li>)}</ul>}
      </section>
      <section>
        <h2>Usage</h2>
        {usage.data ? <Chart points={usage.data} /> : null}
      </section>
      <section>
        <h2>Team</h2>
        {team.isLoading ? <Skeleton rows={3} /> : <ul>{team.data.map(m => <li key={m.id}>{m.name}</li>)}</ul>}
        <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} aria-label="Email" />
        <button onClick={invite}>Invite</button>
        {sent && <p>Invite sent.</p>}
      </section>
    </main>
  );
}
