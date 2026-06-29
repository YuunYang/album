import { useState, useEffect, useRef } from 'react';
import { fetchTracksPage, useGetPlaylist } from 'apis';
import { Album } from 'types';
import getAlbumFromTrack from 'utils/getAlbumFromTrack';

export function usePlaylist(playlistId: string) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const initialized = useRef(false);

  const { data } = useGetPlaylist(playlistId);

  useEffect(() => {
    if (!data?.tracks?.items || initialized.current) return;
    initialized.current = true;

    const tracks = data.tracks.items.map(item => item.track);
    setAlbums(getAlbumFromTrack(tracks));
    setNextUrl(data.tracks.next ?? null);
  }, [data]);

  useEffect(() => {
    if (!nextUrl) return;

    let cancelled = false;
    fetchTracksPage(nextUrl).then((pageData: any) => {
      if (cancelled) return;
      const newAlbums = getAlbumFromTrack(
        pageData?.items?.map((item: any) => item.track) ?? []
      );
      setAlbums(prev => {
        const existingIds = new Set(prev.map(a => a.id));
        return [...prev, ...newAlbums.filter(a => !existingIds.has(a.id))];
      });
      setNextUrl(pageData.next ?? null);
    });

    return () => { cancelled = true; };
  }, [nextUrl]);

  const sortedAlbums = albums.slice().sort(
    (a, b) => (a.release_date > b.release_date ? 1 : -1)
  );

  return { albums: sortedAlbums, data, isLoading: !data && !albums.length };
}
