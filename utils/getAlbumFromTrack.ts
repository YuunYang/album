import { Album, Track } from "types";

export default (tracks: Track[]): Album[] => {
  const albums: Album[] = [];
  
  tracks.forEach((track) => {
    if(albums.findIndex((album) => album.id === track.album.id) === -1) {
      albums.push(track.album);
    }
  })

  return albums.sort((a, b) => a.release_date > b.release_date ? 1 : -1);
}