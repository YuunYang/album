export const PLAYLIST = 'https://api.spotify.com/v1/playlists/{playlist_id}'

export const getPlaylistURL = (playlist_id: string) => {
  return PLAYLIST.replace('{playlist_id}', playlist_id)
}