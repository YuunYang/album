import { ExternalUrls, Followers, Owner, Track, Image } from "./";

export interface GetPlayListRes {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color: null;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    items: {
      added_at: Date;
      added_by: Owner;
      is_local: boolean;
      primary_color: null;
      track: Track;
    }[];
    limit: number;
    next: string | null;
    offset: number;
    previous: null;
    total: number;
  };
  type: string;
  uri: string;
}