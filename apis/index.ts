import { getPlaylistURL } from "constants/apis";
import useSWR from 'swr';
import { GetPlayListRes } from "types/api";

const fetcher = (url: string) => fetch(url, {
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
  }
})
  .then((res) => res.json())
  .then(async (data) => {
    if(data?.error?.status === 401) {
      await getAccessToken()      
    }
    return data
  });

export const useGetPlaylist = (id: string) => {
  const res = useSWR<GetPlayListRes>(getPlaylistURL(id), fetcher)
  return res
}

export const getAccessToken = async () => {
  await fetch("/api/token")
    .then((res) => res.json())
    .then((data) => {
      sessionStorage.setItem('accessToken', data.access_token)
    });
}