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

const Home: NextPage = () => {
  const [albums, setAlbums] = React.useState<AlbumType[]>([]);
  const [color, setColor] = React.useState<number[]>([255, 255, 255]);

  const { data, mutate } = getPlaylist(config.playlist);

  const onCoverHover = (color: number[]) => {
    setColor(color);
  };

  React.useEffect(() => {
    if(data?.error?.status === 401) {
      mutate()
      return;
    }
    const tracks = data?.tracks?.items?.map((item) => item.track) ?? [];
    setAlbums(getAlbumFromTrack(tracks));
  }, [data]);

  const containerBgStyle: any = {
    "--colorFrom": `rgb(${[255, 255, 255].join(",")})`,
    "--colorTo": `rgb(${color.join(",")})`,
  };

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
            {config.comment.cn}
          </div>
        </div>
        <div className={styles.albums}>
          {albums.map((album) => (
            <Album onCoverHover={onCoverHover} key={album.id} album={album} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
