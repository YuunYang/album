import type { NextApiRequest, NextApiResponse } from "next";
import { SPOTIFY_API, spotifyFetch } from "lib/spotify";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Missing playlist id" });
  }

  try {
    const upstream = await spotifyFetch(`${SPOTIFY_API}/playlists/${id}`);
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
