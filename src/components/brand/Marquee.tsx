import { Fragment } from 'react';
import { MARQUEE_ITEMS } from '@/components/brand/data';

/**
 * Marquee — infinite ticker strip. The row renders twice and the track
 * animates -50%, so the loop is seamless.
 */
export default function Marquee() {
  const row = (
    <>
      {MARQUEE_ITEMS.map(item => (
        <Fragment key={item}>
          <span>{item}</span>
          <span className="lum-gem">◆</span>
        </Fragment>
      ))}
    </>
  );

  return (
    <div className="lum-marquee">
      <div className="lum-marquee-track">
        <div className="lum-marquee-row">{row}</div>
        <div className="lum-marquee-row" aria-hidden>{row}</div>
      </div>
    </div>
  );
}
