import type { NextApiRequest, NextApiResponse } from "next";
import { spotifyFetch } from "lib/spotify";

// Proxies the paginated `next` URLs returned by the playlist endpoint. The
// url param is validated to be a Spotify API URL to prevent SSRF.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;
  if (typeof url !== "string") {
    return res.status(400).json({ error: "Missing url" });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid url" });
  }

  if (parsed.hostname !== "api.spotify.com") {
    return res.status(400).json({ error: "Disallowed host" });
  }

  try {
    const upstream = await spotifyFetch(parsed.toString());
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
