'use client';

import React from 'react';
import Image from 'next/image';
import { DestinationTabStrip } from './DestinationTabStrip';
import styles from './AnimatedHeroContent.module.css';

const TILE_IMAGES = [
  '/images/hero/tiles/kashmir-dal-lake.webp',
  '/images/hero/tiles/kerala-backwaters.webp',
  '/images/hero/tiles/rajasthan-fort.webp',
  '/images/hero/tiles/ladakh.webp',
  '/images/hero/tiles/himachal-snow.webp',
  '/images/hero/tiles/goa-beach.webp',
  '/images/hero/tiles/andaman-beach.webp',
  '/images/hero/tiles/meghalaya-root-bridge.webp',
  '/images/hero/tiles/uttarakhand-kedarnath.webp',
  '/images/hero/tiles/taj-mahal.webp',
  '/images/hero/tiles/varanasi-ghats.webp',
  '/images/hero/tiles/bali-temple.webp',
  '/images/hero/tiles/dubai-skyline.webp',
  '/images/hero/tiles/munnar-tea-hills.webp',
];

const FlipTile = ({ i, style }: { i: number, style?: React.CSSProperties }) => {
  const front = TILE_IMAGES[i];
  const back = TILE_IMAGES[(i + 7) % 14];
  
  return (
    <div className={styles.tile} style={style} aria-hidden="true">
      <div className={styles.tileInner}>
        <div className={styles.tileFront}>
           <Image src={front} alt="" fill sizes="110px" priority={true} loading="eager" />
        </div>
        <div className={styles.tileBack}>
           <Image src={back} alt="" fill sizes="110px" priority={true} loading="eager" />
        </div>
      </div>
    </div>
  );
};

export const AnimatedHeroContent: React.FC = () => {
  return (
    <section className={styles.heroContainer}>
      <div className={`${styles.tilesWrapper} ${styles.tilesLeft}`}>
        <div className={`${styles.tileRow} ${styles.rowBottom}`}>
          <FlipTile i={0} style={{ width: 96, height: 107, marginLeft: -27 }} />
          <FlipTile i={1} style={{ width: 86, height: 86 }} />
          <FlipTile i={2} style={{ width: 64, height: 64 }} />
        </div>
        <div className={`${styles.tileRow} ${styles.rowTop}`}>
          <FlipTile i={3} style={{ width: 107, height: 107, marginLeft: -92 }} />
          <FlipTile i={4} style={{ width: 86, height: 86 }} />
          <FlipTile i={5} style={{ width: 75, height: 75 }} />
          <FlipTile i={6} style={{ width: 64, height: 64 }} />
        </div>
      </div>
      
      <div className={styles.centerColumn}>
         <h1 className={styles.headline}>
           Curated Journey, <span className={styles.highlight}>Timeless Memories</span>
         </h1>
         <p className={styles.subtitle}>Explore expertly curated multi-day tours across India</p>
      </div>

      <div className={`${styles.tilesWrapper} ${styles.tilesRight}`}>
        <div className={`${styles.tileRow} ${styles.rowBottom}`}>
          <FlipTile i={7} style={{ width: 64, height: 64 }} />
          <FlipTile i={8} style={{ width: 76, height: 76 }} />
          <FlipTile i={9} style={{ width: 86, height: 86 }} />
          <FlipTile i={10} style={{ width: 107, height: 107, marginRight: -87 }} />
        </div>
        <div className={`${styles.tileRow} ${styles.rowTop}`}>
          <FlipTile i={11} style={{ width: 75, height: 75 }} />
          <FlipTile i={12} style={{ width: 86, height: 86 }} />
          <FlipTile i={13} style={{ width: 107, height: 107, marginRight: -34 }} />
        </div>
      </div>

      <DestinationTabStrip />
    </section>
  );
};
