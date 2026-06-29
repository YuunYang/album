import React from 'react';
import styles from './index.module.scss';

interface Props {
  albumId: string;
}

const PlayerBar = ({ albumId }: Props) => {
  return (
    <div className={styles.player}>
      <iframe
        src={`https://open.spotify.com/embed/album/${albumId}`}
        width="100%"
        height="180"
        frameBorder="0"
        allowFullScreen={false}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    </div>
  );
};

export default PlayerBar;
