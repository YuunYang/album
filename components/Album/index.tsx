import React from 'react';
import { Album } from 'types';
import ColorThief from 'colorthief/dist/color-thief.mjs';
import classnames from 'classnames';
import styles from './index.module.scss';

const colorThief = new ColorThief();

interface Props {
  album: Album;
  isActive: boolean;
  onCoverHover: (color: number[]) => void;
  onCoverClick: (album: Album) => void;
}

const AlbumCard = ({ album, isActive, onCoverHover, onCoverClick }: Props) => {
  const cover = album.images.sort((a, b) => b.height - a.height)[0];

  const onMouseEnter = () => {
    const img = new Image();
    img.src = cover?.url;
    img.crossOrigin = 'Anonymous';
    img.addEventListener('load', function () {
      onCoverHover(colorThief.getColor(img));
    });
  };

  const onMouseLeave = () => {
    onCoverHover([255, 255, 255]);
  };

  return (
    <div
      className={classnames(styles.wrapper, { [styles.active]: isActive })}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => onCoverClick(album)}
    >
      <div className={styles.coverContainer}>
        <div
          className={styles.cover}
          style={{ backgroundImage: `url(${cover?.url})` }}
        />
        <div className={styles.overlay}>
          <div className={styles.playIcon} />
        </div>
      </div>
      <div className={styles.artists}>
        {album.artists.map(artist => (
          <a
            key={artist.id}
            target="_blank"
            href={artist.external_urls.spotify}
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
          >
            {artist.name}
          </a>
        ))}
      </div>
      <div className={styles.name}>{album.name}</div>
      <div className={styles.release}>{album.release_date}</div>
    </div>
  );
};

export default AlbumCard;
