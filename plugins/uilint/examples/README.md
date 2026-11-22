# Examples

Three small components with seeded state bugs, and the findings `uilint` should report. Use them to
check that an install works and to see what a finding looks like. Each file is plain code; nothing here runs.

Try it: open one file in Claude Code and run `/uilint`. You should get a verdict line, then a
`Blocking` list matching the one below.

## 1. `list.jsx` — silent fetch failure

```jsx
function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch("/api/orders").then(r => r.json()).then(setOrders).catch(() => {});
  }, []);
  return <ul>{orders.map(o => <li key={o.id}>{o.name}</li>)}</ul>;
}
```

Expected:

- `list.jsx:5 · R-FEEDBACK-02` blocking. A failed request shows an empty list, identical to "no orders".
- `list.jsx:7 · R-STATE-02` blocking. Nothing renders while the request is in flight.
- `list.jsx:7 · R-STATE-08` worth fixing, only if the list can legitimately be empty (check `Applies`).

## 2. `form.jsx` — disabled submit, no confirmation

```jsx
function Invite() {
  const [email, setEmail] = useState("");
  const valid = /.+@.+/.test(email);
  return (
    <form onSubmit={() => fetch("/api/invite", { method: "POST", body: email })}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button disabled={!valid}>Send invite</button>
    </form>
  );
}
```

Expected:

- `form.jsx:7 · R-FORM-01` blocking. The button is greyed with no hint why.
- `form.jsx:5 · R-FEEDBACK-07` blocking. Success and failure of the POST are both invisible.
- `form.jsx:5 · R-STATE-15` blocking. No working state, so a second press sends a second invite.

## 3. `page.jsx` — one failure blanks the page

```jsx
function Dashboard() {
  const user = useQuery("user", getUser);
  const stats = useQuery("stats", getStats);
  if (user.isError || stats.isError) return <p>Error</p>;
  return <Layout user={user.data} stats={stats.data} />;
}
```

Expected:

- `page.jsx:4 · R-STATE-12` blocking. If only `stats` fails, the loaded user data is thrown away.
- `page.jsx:4 · R-FEEDBACK-03` blocking. "Error" names no cause and offers no next step.
