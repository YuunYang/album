import classnames from "classnames";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import config from "../album-config.json";
import { getPlaylist } from "../apis";
import Album from "../components/Album";
import styles from "../styles/Home.module.scss";
import { Album as AlbumType } from "../types";
import getAlbumFromTrack from "../utils/getAlbumFromTrack";
import commentFile from "../comment.md";
import { markdownToHtml } from "../utils/markdownToHtml";

const Home: NextPage = () => {
  const [albums, setAlbums] = React.useState<AlbumType[]>([]);
  const [color, setColor] = React.useState<number[]>([255, 255, 255]);
  const [comment, setComment] = React.useState<string>("");
  const [hide, setHide] = React.useState(false);
  const [activatedAlbum, setActivatedAlbum] = React.useState<AlbumType>();

  const { data, mutate } = getPlaylist(config.playlist);

  const onCoverHover = (color: number[]) => {
    setColor(color);
  };

  const onCoverClick = (album: AlbumType) => {
    setActivatedAlbum(album);
  }

  React.useEffect(() => {
    (async () => {
      setComment(await markdownToHtml(commentFile));
    })();
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const resize = () => {
        setHide(window.innerWidth < 960);
      };
      resize();
      window.addEventListener("resize", resize);
      return () => {
        window.removeEventListener("resize", resize);
      };
    }
  }, []);

  React.useEffect(() => {
    if ((data as any)?.error?.status === 401) {
      mutate();
      return;
    }
    const tracks = data?.tracks?.items?.map((item) => item.track) ?? [];
    const albums = getAlbumFromTrack(tracks)
    setAlbums(albums);
    setActivatedAlbum(albums[0])
  }, [data, mutate]);

  const containerBgStyle: any = {
    "--colorFrom": `rgb(${[255, 255, 255].join(",")})`,
    "--colorTo": `rgb(${color.join(",")})`,
  };

  const groupedAlbums = (albums: AlbumType[]): AlbumType[][] => {
    return albums.reduce(
      (r: any[], e, i) => (i % 4 ? r[r.length - 1].push(e) : r.push([e])) && r,
      []
    );
  };

  if (hide) {
    return (
      <div className={classnames(styles.container)} style={containerBgStyle}>
        <div className={styles.warning}>Please use desktop browser</div>
      </div>
    );
  }

  return (
    <div className={classnames(styles.container)} style={containerBgStyle}>
      <Head>
        <title>Album Space</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.infos}>
          <div className={styles.title}>{data?.name}</div>
          <div className={styles.info}>
            Collect by {data?.owner?.display_name} in{" "}
            <a target="__blank" href={data?.external_urls?.spotify}>
              {data?.name}
            </a>
          </div>
          <div className={styles.comment}>
            <div dangerouslySetInnerHTML={{ __html: comment }} />
          </div>
        </div>
        <div className={styles.albums}>
          {groupedAlbums(albums).map((albumGroup, idx) => (
            <div className={styles.albumWrapper} key={idx}>
              {albumGroup.map((album) => (
                <Album
                  key={album.id}
                  onCoverHover={onCoverHover}
                  onCoverClick={onCoverClick}
                  album={album}
                />
              ))}
            </div>
          ))}
        </div>
      </main>
      {activatedAlbum && (
        <div className={styles.player}>
          <iframe
            style={{ borderRadius: 12 }}
            src={`https://open.spotify.com/embed/album/${activatedAlbum.id}`}
            width="100%"
            height="180"
            frameBorder="0"
            allowFullScreen={false}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default Home;
