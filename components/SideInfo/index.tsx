import React, { Suspense } from 'react';
import Image from 'next/image';
import getIcon from 'components/Icon';
import { Image as ImageType } from 'types';
import styles from './index.module.scss';

interface Props {
  cover?: ImageType;
  name?: string;
  description?: string;
  comment: string;
  social: Record<string, string>;
  isMobile: boolean;
}

const SideInfo = ({ cover, name, description, comment, social, isMobile }: Props) => {
  return (
    <div className={styles.sideInfo}>
      <div className={styles.infos}>
        {cover && (
          <div className={styles.cover}>
            <Image
              alt="playlist cover"
              src={cover.url}
              height={100}
              width={100}
            />
          </div>
        )}
        <div className={styles.description}>
          {name && <div className={styles.title}>{name}</div>}
          {description && <div className={styles.info}>{description}</div>}
          <div className={styles.social}>
            {Object.keys(social).map(type => {
              const Icon = getIcon(type);
              return (
                <div className={styles.icon} key={type}>
                  <a
                    target="_blank"
                    href={social[type]}
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
      {comment && (
        <div
          className={styles.comment}
          dangerouslySetInnerHTML={{ __html: comment }}
        />
      )}
    </div>
  );
};

export default SideInfo;
