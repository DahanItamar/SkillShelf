const MAX_ATTEMPTS = 2;

export async function fetchPage(url, { timeout }) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(timeout * 1000) });
      return { status: res.status, body: await res.text() };
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}
