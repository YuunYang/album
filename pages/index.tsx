import classnames from "classnames";
import type { NextPage } from "next";
import Head from "next/head";
import React, { Suspense } from "react";
import config from "album-config.json";
import { useGetPlaylist } from "apis";
import Album from "components/Album";
import styles from "styles/Home.module.scss";
import { Album as AlbumType } from "types";
import getAlbumFromTrack from "utils/getAlbumFromTrack";
import commentFile from "comment.md";
import { markdownToHtml } from "utils/markdownToHtml";
import { useRouter } from "next/router";
import Image from "next/image";
import getIcon from "components/Icon";

const Home: NextPage = () => {
  const router = useRouter();
  const { albumId } = router.query;
  const [albums, setAlbums] = React.useState<AlbumType[]>([]);
  const [color, setColor] = React.useState<number[]>([255, 255, 255]);
  const [comment, setComment] = React.useState<string>("");
  const [hide, setHide] = React.useState(false);
  const [activatedAlbum, setActivatedAlbum] = React.useState<AlbumType>();

  const { data, mutate } = useGetPlaylist(config.playlist);

  const onCoverHover = (color: number[]) => {
    setColor(color);
  };

  const onCoverClick = React.useCallback(
    (album: AlbumType) => {
      router.push(`/?albumId=${album.id}`, undefined, { shallow: true });
      setActivatedAlbum(album);
    },
    [router]
  );

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
    const albums = getAlbumFromTrack(tracks);
    setAlbums(albums);
    if (!activatedAlbum && albums.length > 0) {
      let target = albums[0];
      if (albumId) {
        target = albums.find((item) => item.id === albumId) ?? target;
      }
      onCoverClick(target);
    }
  }, [activatedAlbum, albumId, data, mutate, onCoverClick]);

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

  const cover = data?.images?.sort((a, b) => b.height - a.height)[0];

  return (
    <div className={classnames(styles.container)} style={containerBgStyle}>
      <Head>
        <title>Album Space</title>
        <meta name="description" content="Album Space" />
        <link rel="icon" href={data?.images?.[0].url ?? "/TheBeatles.ico"} />
      </Head>

      <main className={styles.main}>
        <div className={styles.infos}>
          <div className={styles.cover}>
            {cover && (
              <Image
                alt="cover"
                src={cover?.url}
                height={cover?.height ?? 100}
                width={cover?.width ?? 100}
              />
            )}
          </div>
          <div className={styles.description}>
            <div className={styles.title}>{data?.name}</div>
            <div className={styles.info}>
              Collect by {data?.owner?.display_name} in{" "}
              <a target="__blank" href={data?.external_urls?.spotify}>
                {data?.name}
              </a>
              . {data?.description}
            </div>
            <div className={styles.social}>
              {Object.keys(config.social)?.map((type) => {
                  const Icon = getIcon(type)
                  return <div className={styles.icon} key={type}>
                    <a target="_blank" href={config.social[type as keyof typeof config.social]} rel="noreferrer">
                      <Suspense>
                      <Icon />
                    </Suspense>
                    </a>
                  </div>
              })}
            </div>
          </div>
        </div>
        <div className={styles.comment}>
          <div dangerouslySetInnerHTML={{ __html: comment }} />
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
            style={{ borderRadius: 12, border: "2px solid" }}
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
