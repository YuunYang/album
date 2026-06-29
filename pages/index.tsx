import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import config from 'album-config.json';
import { Album } from 'types';
import { usePlaylist } from 'hooks/usePlaylist';
import { useTheme } from 'hooks/useTheme';
import { getIsMobile } from 'utils/common';
import { markdownToHtml } from 'utils/markdownToHtml';
import commentFile from 'comment.md';
import { useRouter } from 'next/router';
import AlbumCard from 'components/Album';
import SideInfo from 'components/SideInfo';
import PlayerBar from 'components/PlayerBar';
import ThemeToggle from 'components/ThemeToggle';
import styles from 'styles/Home.module.scss';

const Home: NextPage = () => {
  const router = useRouter();
  const { albumId, open } = router.query;

  const [color, setColor] = React.useState<number[]>([255, 255, 255]);
  const [comment, setComment] = React.useState('');
  const [isMobile, setIsMobile] = React.useState(false);
  const [activatedAlbum, setActivatedAlbum] = React.useState<Album>();
  const hasInitialized = React.useRef(false);

  const { darkMode, setDarkMode } = useTheme();
  const { albums, data } = usePlaylist(config.playlist);

  React.useEffect(() => {
    markdownToHtml(commentFile).then(setComment);
  }, []);

  React.useEffect(() => {
    const mobile = getIsMobile();
    setIsMobile(mobile);
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    setDarkMode(mobile ? prefersDark : false);
  }, [setDarkMode]);

  React.useEffect(() => {
    if (!albums.length || hasInitialized.current) return;
    hasInitialized.current = true;

    const target = albumId
      ? albums.find(a => a.id === albumId) ?? albums[0]
      : albums[0];

    setActivatedAlbum(target);
    router.push(`/?albumId=${target.id}`, undefined, { shallow: true });
    if (isMobile && open) {
      window.open(`https://open.spotify.com/album/${target.id}`, '_top');
    }
  }, [albums]);

  const onCoverHover = React.useCallback((c: number[]) => setColor(c), []);

  const onCoverClick = React.useCallback((album: Album) => {
    setActivatedAlbum(album);
    router.push(`/?albumId=${album.id}`, undefined, { shallow: true });
    if (isMobile) {
      window.open(`https://open.spotify.com/album/${album.id}`, '_top');
    }
  }, [isMobile, router]);

  const containerStyle: React.CSSProperties & Record<string, string> = {
    '--colorFrom': `rgb(${darkMode ? '0,0,0' : (isMobile ? color : [255, 255, 255]).join(',')})`,
    '--colorTo': `rgb(${darkMode ? '0,0,0' : color.join(',')})`,
  };

  const cover = data?.images?.slice().sort((a, b) => b.height - a.height)[0];

  return (
    <div className={styles.container} style={containerStyle}>
      <Head>
        <title>Album Space</title>
        <meta name="description" content="Album Space" />
        <meta
          name="viewport"
          content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width"
        />
        <link rel="icon" href={data?.images?.[0]?.url ?? '/TheBeatles.ico'} />
      </Head>

      <main className={styles.main}>
        <SideInfo
          cover={cover}
          name={data?.name}
          description={data?.description}
          comment={comment}
          social={config.social}
          isMobile={isMobile}
        />

        <div className={styles.albums}>
          {albums.map(album => (
            <AlbumCard
              key={album.id}
              album={album}
              isActive={activatedAlbum?.id === album.id}
              onCoverHover={onCoverHover}
              onCoverClick={onCoverClick}
            />
          ))}
        </div>
      </main>

      {activatedAlbum && !isMobile && <PlayerBar albumId={activatedAlbum.id} />}
      <ThemeToggle darkMode={darkMode} onChange={setDarkMode} />
    </div>
  );
};

export default Home;
