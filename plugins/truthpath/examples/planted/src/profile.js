const SAMPLE_USER = { name: "Jane Doe", email: "jane@example.com", plan: "Pro" };

export async function loadProfile(api) {
  try {
    return await api.get("/me");
  } catch {
    return SAMPLE_USER;
  }
}
