function Dashboard() {
  const user = useQuery("user", getUser);
  const stats = useQuery("stats", getStats);
  if (user.isError || stats.isError) return <p>Error</p>;
  return <Layout user={user.data} stats={stats.data} />;
}
