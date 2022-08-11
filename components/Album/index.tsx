import { Album } from "../../types";
import styles from "./index.module.scss";
import ColorThief from "colorthief/dist/color-thief.mjs";
import config from "../../album-config.json";
import React from "react";

const colorThief = new ColorThief();

interface Props {
  album: Album;
  onCoverHover: (color: number[]) => void;
  onCoverClick: (album: Album) => void;
}

const Album = (props: Props) => {
  const { album, onCoverHover, onCoverClick } = props;

  const cover = album.images.sort((a, b) => b.height - a.height)[0];
  const [isHover, setIsHover] = React.useState(false);

  const onMouseEnter = () => {
    const img = new Image();
    img.src = cover?.url;
    img.crossOrigin = "Anonymous";
    img.addEventListener("load", function () {
      const color = colorThief.getColor(img);
      onCoverHover(color);
    });
    setIsHover(true);
  };

  const onMouseLeave = () => {
    setIsHover(false);
    onCoverHover([255, 255, 255]);
  };

  const onClick = () => {
    onCoverClick(album)
  }

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={styles.cover}
        onClick={onClick}
        style={{ backgroundImage: `url(${cover?.url})` }}
      />
      <div className={styles.artists}>
        {album.artists.map((artist) => {
          return (
            <a
              key={artist.id}
              target="__blank"
              href={artist.external_urls.spotify}
            >
              {artist.name}
            </a>
          );
        })}
      </div>
      <div className={styles.name}>{album.name}</div>
      <div className={styles.release}>{album.release_date}</div>
    </div>
  );
};

export default Album;
