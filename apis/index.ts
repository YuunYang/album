import useSWR from "swr";
import { GetPlayListRes } from "types/api";

// All Spotify calls go through our own backend proxy, which attaches the
// access token server-side. The browser never handles a token.
export const fetcher = (url: string) =>
  fetch(url).then((res) => res.json());

export const useGetPlaylist = (id: string) => {
  return useSWR<GetPlayListRes>(`/api/playlist/${id}`, fetcher);
};

// Fetch a paginated `next` URL through the proxy.
export const fetchTracksPage = (nextUrl: string) =>
  fetcher(`/api/tracks?url=${encodeURIComponent(nextUrl)}`);
