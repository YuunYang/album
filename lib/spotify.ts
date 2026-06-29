// Server-only Spotify helper. Holds the client secret and a cached access
// token in module memory so the browser never sees either.

const TOKEN_URL = "https://accounts.spotify.com/api/token";
export const SPOTIFY_API = "https://api.spotify.com/v1";

let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.value;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET environment variables"
    );
  }

  const body = new URLSearchParams({ grant_type: "client_credentials" });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`Token request failed: ${res.status}`);
  }

  const data = await res.json();
  // Refresh a minute early to avoid using a token that expires mid-request.
  cachedToken = {
    value: data.access_token,
    expiresAt: now + (data.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

// Fetch any Spotify Web API URL with a bearer token attached. Returns the raw
// upstream Response so callers can forward status codes (e.g. 403/404).
export async function spotifyFetch(url: string): Promise<Response> {
  const token = await getAccessToken();
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } });
}
