import classnames from "classnames";
import type { NextPage } from "next";
import Head from "next/head";
import React, { Suspense } from "react";
import config from "album-config.json";
import { fetcher, useGetPlaylist } from "apis";
import Album from "components/Album";
import styles from "styles/Home.module.scss";
import { Album as AlbumType } from "types";
import getAlbumFromTrack from "utils/getAlbumFromTrack";
import commentFile from "comment.md";
import { markdownToHtml } from "utils/markdownToHtml";
import { useRouter } from "next/router";
import Image from "next/image";
import getIcon from "components/Icon";
import { getIsMobile } from "utils/common";
import Toggle from "react-toggle";
import Moon from 'public/icons/moon.svg'
import Sun from 'public/icons/sun.svg'
import { GetPlayListRes } from "types/api";

const Home: NextPage = () => {
  const router = useRouter();
  const { albumId, open } = router.query;
  const [count, setCount] = React.useState(6);
  const [albums, setAlbums] = React.useState<AlbumType[]>([]);
  const [next, setNext] = React.useState('');
  const [color, setColor] = React.useState<number[]>([255, 255, 255]);
  const [comment, setComment] = React.useState<string>("");
  const [activatedAlbum, setActivatedAlbum] = React.useState<AlbumType>();
  const [isMobile, setIsMobile] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(true);

  const { data, mutate } = useGetPlaylist(config.playlist);

  const onCoverHover = React.useCallback((color: number[]) => {
    setColor(color);
  }, []);

  const onCoverClick = React.useCallback(
    (album: AlbumType, open = true) => {
      if (albumId !== album.id || !activatedAlbum) {
        router.push(`/?albumId=${album.id}`, undefined, { shallow: true });
        setActivatedAlbum(album);
      }
      if (isMobile && open) {
        window.open(`https://open.spotify.com/album/${album.id}`, "_top");
      }
    },
    [router]
  );

  React.useEffect(() => {
    (async () => {
      setComment(await markdownToHtml(commentFile));
    })();
  }, []);

  React.useEffect(() => {
    const isMobile = getIsMobile();
    setIsMobile(isMobile);
    if (typeof window !== "undefined") {
      const resize = () => {
        const width = window.innerWidth;
        if (width > 1050) {
          setCount(6);
        } else if (width <= 1050 && width > 860) {
          setCount(4);
        } else if (width <= 860 && width > 680) {
          setCount(3);
        } else if (width <= 680 && width > 460) {
          setCount(2);
        } else {
          setCount(1);
        }
      };
      resize();
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(isMobile ? isDarkMode : false)
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
    setNext(data?.tracks?.next || '');
    if (!activatedAlbum && albums.length > 0) {
      let target = albums[0];
      if (albumId) {
        target = albums.find((item) => item.id === albumId) ?? target;
      }
      onCoverClick(target, !!open);
    }
  }, [data, mutate, onCoverClick]);

  React.useEffect(() => {
    if(darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [darkMode]);

  React.useEffect(() => {
    if(!next) return;
    fetcher(next).then((data: GetPlayListRes['tracks']) => {
      setAlbums((pre) => [...pre, ...getAlbumFromTrack(data?.items?.map((item) => item.track))]);
      if(data.next) {
        setNext(data.next)
      }
    })
  }, [next])

  const containerBgStyle: any = {
    "--colorFrom": `rgb(${darkMode ? [0,0,0] : (!isMobile ? [255, 255, 255] : color).join(",")})`,
    "--colorTo": `rgb(${darkMode ? [0,0,0] : color.join(",")})`,
  };

  const groupedAlbums = React.useMemo((): AlbumType[][] => {
    return albums.sort((a, b) => a.release_date > b.release_date ? 1 : -1).reduce(
      (r: any[], e, i) =>
        (i % count ? r[r.length - 1].push(e) : r.push([e])) && r,
      []
    );
  }, [albums, count]);

  const cover = data?.images?.sort((a, b) => b.height - a.height)[0];
  

  return (
    <div className={classnames(styles.container)} style={containerBgStyle}>
      <Head>
        <title>Album Space</title>
        <meta name="description" content="Album Space" />
        <meta
          name="split-bill"
          content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width"
        />
        <link rel="icon" href={data?.images?.[0].url ?? "/TheBeatles.ico"} />
      </Head>

      <main className={styles.main}>
        <div className={styles.content}>
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
              <div className={styles.info}>{data?.description}</div>
              <div className={styles.social}>
                {Object.keys(config.social)?.map((type) => {
                  const Icon = getIcon(type);
                  return (
                    <div className={styles.icon} key={type}>
                      <a
                        target="_blank"
                        href={config.social[type as keyof typeof config.social]}
                        rel="noreferrer"
                      >
                        <Suspense>
                          <Icon />
                        </Suspense>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {isMobile && (
            <div className={styles.alert}>
              Use desktop browser for better experience.
            </div>
          )}
          <div className={styles.comment}>
            <div dangerouslySetInnerHTML={{ __html: comment }} />
          </div>
        </div>
        <div className={styles.albums}>
          {groupedAlbums.map((albumGroup, idx) => (
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
      {activatedAlbum && !isMobile && (
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
      <label className={styles.darkCheckbox}>
        <Toggle
          checked={darkMode}
          icons={{
            unchecked: <Sun />,
            checked: <Moon />
          }}
          onChange={(e) => setDarkMode(e.target.checked)}
        />
      </label>
    </div>
  );
};

export default Home;
